class Api::Buyer::AuctionResultsController < Api::BaseController
  before_action :buyer_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.find_by_consumptions(current_user).where(search_where_array)
                            .page(params[:page_index]).per(params[:page_size]).select("auction_results.*, consumptions.participation_status, consumptions.acknowledge")
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = [
      { name: 'ID', field_name: 'published_gid' },
      { name: 'Name', field_name: 'name' },
      { name: 'Date', field_name: 'start_datetime' },
    ]
    # user = User.find(current_user.id)
    if current_user.consumer_type == '2'
      headers.push(name: 'Acknowledgement Status', field_name: 'acknowledge')
      headers.push(name: 'Reverse Auction Report', field_name: 'report')
      headers.push(name: 'Letter of Award', field_name: 'award')
    else
      headers.push(name: 'Reverse Auction Report', field_name: 'report')
    end

    data = []
    result.order(created_at: :desc).each do |result|
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                acknowledge: show_award?(result, current_user) ? result.acknowledge : nil ,
                report: result.participation_status=='1' ? "api/buyer/auctions/#{result.auction_id}/pdf" : '',
                award: show_award?(result, current_user) ? result.participation_status=='1' ? "api/buyer/auctions/#{result.auction_id}/letter_of_award_pdf" : '' : '')
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end

  private

  def show_award?(result, current_user)
    consumption = Consumption.find_by_auction_and_user(result.auction_id, current_user.id).first
    user = User.find(current_user.id)
    result.status != 'void' && consumption.participation_status == Consumption::ParticipationStatusParticipate && user.consumer_type == User::ConsumerTypeCompany
  end
end
