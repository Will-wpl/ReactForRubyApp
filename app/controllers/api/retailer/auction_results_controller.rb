class Api::Retailer::AuctionResultsController < Api::BaseController
  before_action :retailer_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.find_by_arrangement(current_user).where(search_where_array)
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
      { name: 'My Result', field_name: 'my_result' },
      { name: 'Letter of Award', field_name: 'award' }
    ]
    data = []
    result.order(created_at: :desc).each do |result|
      my_result = if result.status == 'void'
                    'Tender Void'
                  else
                    result.user_id == current_user.id ? 'Tender Awarded' : 'Tender Not Awarded'
                  end
      company_user_count = Consumption.get_company_user_count(result.auction_id)
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                my_result: my_result,
                award: company_user_count != 0 ? "admin/auctions/#{result.auction_id}/award" : '')
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end

end