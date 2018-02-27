class Api::Admin::AuctionResultsController < Api::BaseController
  before_action :admin_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.left_outer_joins(:auction).where(search_where_array)
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
      { name: 'Contract Period', field_name: 'contract_period' },
      { name: 'Status', field_name: 'status' },
      { name: 'Lowest Price Bidder', field_name: 'lowest_price_bidder' },
      { name: 'Lowest Average Price', field_name: 'lowest_average_price' },
      { name: 'Total Volume', field_name: 'total_volume' },
      { name: 'Reverse Auction Report', field_name: 'report' },
      { name: 'Activities Log', field_name: 'log' },
      { name: 'Letter of Award', field_name: 'award' }
    ]
    data = []
    result.order(created_at: :desc).each do |result|
      lap = number_to_currency(result.lowest_average_price, unit: '$ ', precision: 4)
      tv = number_to_currency(result.total_volume, unit: '', precision: 0)
      company_user_count = Consumption.get_company_user_count(result.auction_id)
      data.push(published_gid: result.auction.published_gid,
                name: result.auction.name,
                start_datetime: result.auction.start_datetime,
                contract_period: "#{result.contract_period_start_date.strftime('%d %b %Y')} to #{result.contract_period_end_date.strftime('%d %b %Y')}",
                status: status == 'void' ? 'Void' : 'Awarded',
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

  def award
    consumptions = Consumption.get_company_user(params[:id])
    data = []
    consumptions.each do |consumption|
      data.push(name: consumption.user.company_name, acknowledge: consumption.acknowledge, download_url: nil)
    end
    render json: data, status: 200

  end

end