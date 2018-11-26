class Api::Admin::AuctionResultsController < Api::AuctionResultsController
  before_action :admin_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.left_outer_joins(:auction).where('auction_results.status = ?', '1').where(search_where_array)
                   .page(params[:page_index]).per(params[:page_size])
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = get_headers
    data = []
    results = get_order_list(result, params, headers)
    results.each do |result|
      if result.auction_result_contracts.blank?
        data.push(set_result(result))
      else
        data.push(set_contracts_result(result))
      end

    end
    actions = [
        {url: '/admin/auctions/:id/retailer_dashboard?past', name: 'Retailer Dashboard', icon: 'edit', interface_type: 'auction'},
        {url: '/admin/auctions/:id/buyer_dashboard?past', name: 'Buyer Dashboard', icon: 'view', interface_type: 'auction'}
    ]
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  private

  def set_result(result)
    company_user_count = Consumption.get_company_user_count(result.auction_id)
    lap = number_to_currency(result.lowest_average_price, unit: '$ ', precision: 4)
    tv = number_to_currency(result.total_volume, unit: '', precision: 0)
    data = {id: result.auction.id,
            published_gid: result.auction.published_gid, name: result.auction.name, start_datetime: result.auction.start_datetime,
            contract_period: "#{result.contract_period_start_date.strftime('%d %b %Y')} to #{result.contract_period_end_date.strftime('%d %b %Y')}",
            status: get_status_string(result),
            lowest_price_bidder: result.lowest_price_bidder,
            lowest_average_price: "#{lap}/kWh",
            total_volume: "#{tv}kWh",
            report: "admin/auctions/#{result.auction_id}/report",
            log: "admin/auctions/#{result.auction_id}/log",
            award: get_award_new_url(company_user_count, result, nil)}
    data
  end

  def set_contracts_result(result)
    contracts = []
    result.auction_result_contracts.each do |result_contract|
      company_user_count = Consumption.get_company_user_duration_count(result_contract.auction_id, result_contract.contract_duration)
      lap = number_to_currency(result_contract.lowest_average_price, unit: '$ ', precision: 4)
      tv = number_to_currency(result_contract.total_volume, unit: '', precision: 0)
      contracts.push({
                         contract_period: "#{result_contract.contract_duration} months: #{result.contract_period_start_date.strftime('%d %b %Y')} to #{result_contract.contract_period_end_date.strftime('%d %b %Y')}",
                         status: get_status_string(result_contract),
                         lowest_price_bidder: result_contract.lowest_price_bidder,
                         lowest_average_price: "#{lap}/kWh",
                         total_volume: "#{tv}kWh",
                         report: "admin/auctions/#{result_contract.auction_id}/report?contract_duration=#{result_contract.contract_duration}",
                         log: "admin/auctions/#{result_contract.auction_id}/log?contract_duration=#{result_contract.contract_duration}",
                         award: get_award_url(company_user_count, result_contract,result_contract.contract_duration)
                     })
    end

    data = {id: result.auction.id,
           published_gid: result.auction.published_gid, name: result.auction.name, start_datetime: result.auction.start_datetime,
           contracts: contracts}
    data
  end

  def get_order_list(result, params, headers)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      result.order(order_by_string)
    else
      result.order(created_at: :desc)
    end
  end

  def get_award_url(company_user_count, result, contract_duration)
    if contract_duration.blank?
      company_user_count != 0 && result.status != 'void' ? "admin/auctions/#{result.auction_id}/award" : ''
    else
      company_user_count != 0 && result.status != 'void' ? "admin/auctions/#{result.auction_id}/award?contract_duration=#{contract_duration}" : ''
    end

  end

  def get_award_new_url(company_user_count, result, contract_duration)
    if contract_duration.blank?
      company_user_count != 0 && result.status != 'void' ? ["admin/auctions/#{result.auction_id}/award"] : []
    else
      company_user_count != 0 && result.status != 'void' ? ["admin/auctions/#{result.auction_id}/award?contract_duration=#{contract_duration}"] : []
    end

  end

  def get_status_string(result)
    result.status == 'void' ? 'Void' : 'Awarded'
  end

  def get_headers
    [
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
        { name: 'Closing of Electricity Purchase Contract', field_name: 'award', is_sort: false }
    ]
  end

end