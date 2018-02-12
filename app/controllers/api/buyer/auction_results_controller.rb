class Api::Buyer::AuctionResultsController < Api::BaseController
  before_action :buyer_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.find_by_consumptions(current_user).where(search_where_array)
                   .page(params[:page_index]).per(params[:page_size])
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = [
      { name: 'ID', field_name: 'published_gid' },
      { name: 'Name', field_name: 'name' },
      { name: 'Date', field_name: 'start_datetime' },
      { name: 'Reverse Auction Report', field_name: 'report' },
      { name: 'Letter of Award', field_name: 'award' }
    ]
    data = []
    result.order(created_at: :desc).each do |result|
      company_user_count = Consumption.get_company_user_count(result.auction_id)
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                report: "admin/auctions/#{result.auction_id}/report",
                award: company_user_count != 0 && result.status != 'void' ? "admin/auctions/#{result.auction_id}/award" : '')
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end

end