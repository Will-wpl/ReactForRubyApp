class Api::Admin::AuctionResultsController < Api::AuctionResultsController
  before_action :admin_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.left_outer_joins(:auction).where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = [
      { name: 'ID', field_name: 'published_gid', table_name: 'auctions'},
      { name: 'Name', field_name: 'name', table_name: 'auctions'},
      { name: 'Date', field_name: 'start_datetime', table_name: 'auctions'},
      { name: 'Contract Period', field_name: 'contract_period', is_sort: false },
      { name: 'Status', field_name: 'status', table_name: 'auction_results' },
      { name: 'Winning Bidder', field_name: 'lowest_price_bidder', table_name: 'auction_results' },
      { name: 'Average Price', field_name: 'lowest_average_price', table_name: 'auction_results' },
      { name: 'Total Volume', field_name: 'total_volume', table_name: 'auction_results' },
      { name: 'Reverse Auction Report', field_name: 'report', is_sort: false },
      { name: 'Activities Log', field_name: 'log', is_sort: false },
      { name: 'Letter of Award', field_name: 'award', is_sort: false }
    ]
    data = []
    results = if params.key?(:sort_by)
               order_by_string = get_order_by_obj_str(params[:sort_by], headers)
               result.order(order_by_string)
             else
               result.order(created_at: :desc)
             end
    results.each do |result|
      lap = number_to_currency(result.lowest_average_price, unit: '$ ', precision: 4)
      tv = number_to_currency(result.total_volume, unit: '', precision: 0)
      company_user_count = Consumption.get_company_user_count(result.auction_id)
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                contract_period: "#{result.contract_period_start_date.strftime('%d %b %Y')} to #{result.contract_period_end_date.strftime('%d %b %Y')}",
                status: result.status == 'void' ? 'Void' : 'Awarded',
                lowest_price_bidder: result.lowest_price_bidder,
                lowest_average_price: "#{lap}/kWh",
                total_volume: "#{tv}kWh",
                report: "admin/auctions/#{result.auction_id}/report",
                log: "admin/auctions/#{result.auction_id}/log",
                award: company_user_count != 0 && result.status != 'void' ? "admin/auctions/#{result.auction_id}/award" : '')
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end


end