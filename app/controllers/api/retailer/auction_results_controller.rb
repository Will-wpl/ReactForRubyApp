class Api::Retailer::AuctionResultsController < Api::AuctionResultsController
  before_action :retailer_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.find_by_arrangement(current_user).where(search_where_array)
                            .page(params[:page_index]).per(params[:page_size])
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = [
      { name: 'ID', field_name: 'published_gid', table_name: 'auctions' },
      { name: 'Name', field_name: 'name', table_name: 'auctions' },
      { name: 'Date', field_name: 'start_datetime', table_name: 'auctions' },
      { name: 'My Result', field_name: 'my_result', is_sort: false },
      { name: 'Letter of Award', field_name: 'award', is_sort: false }
    ]
    data = []
    results = get_order_list(params, headers, result)
    results.each do |result|
      company_user_count = Consumption.get_company_user_count(result.auction_id)
      my_result = get_result(result)
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                my_result: my_result,
                award: get_award(company_user_count, result),
                id: result.auction.id)
    end
    bodies = { data: data, total: total }
    actions = [{url: '/retailer/arrangements/:id/tender', name: 'Manage', interface_type: 'auction'}]
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  private

  def show_award?(result, current_user)
    result.user_id == current_user.id && result.status != 'void'
  end

  def get_order_list(params, headers, result)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      result.order(order_by_string)
    else
      result.order(created_at: :desc)
    end
  end

  def get_result(result)
    if result.status == 'void'
      'Tender Void'
    else
      result.user_id == current_user.id ? 'Tender Awarded' : 'Tender Not Awarded'
    end
  end

  def get_award(company_user_count, result)
    company_user_count != 0 && show_award?(result, current_user) ? "retailer/auctions/#{result.auction_id}/award" : ''
  end
end
