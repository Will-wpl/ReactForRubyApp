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
      { name: 'Reference ID', field_name: 'published_gid', table_name: 'auctions' },
      { name: 'Name', field_name: 'name', table_name: 'auctions' },
      { name: 'Auction Date/Time', field_name: 'start_datetime', table_name: 'auctions' },
      { name: 'Contract Period', field_name: 'contract_period', is_sort: false },
      { name: 'My Result', field_name: 'my_result', is_sort: false },
      { name: 'Closing of Electricity Purchase Contract', field_name: 'award', is_sort: false }
    ]
    data = []
    results = get_order_list(params, headers, result)
    results.each do |result|
      if result.auction_result_contracts.blank?
        data.push(set_result(result))
      else
        data.push(set_contracts_result(result))
      end
    end
    bodies = { data: data, total: total }
    actions = [{url: '/retailer/arrangements/:id/tender?past', name: 'View History', icon:'view', interface_type: 'auction'}]
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  private

  def set_result(result)
    company_user_count = Consumption.get_company_user_count(result.auction_id)
    my_result = get_result(result)
    data = {
        contract_period: "#{result.contract_period_start_date.strftime('%d %b %Y')} to #{result.contract_period_end_date.strftime('%d %b %Y')}",
        published_gid: result.auction.published_gid,
        name: result.auction.name,
        start_datetime: result.auction.start_datetime,
        my_result: my_result,
        award: get_award(company_user_count, result, nil),
        id: Arrangement.auction_of_current_user(result.auction.id, current_user.id).first.id,
        auction_id: result.auction.id
    }
    data
  end

  def set_contracts_result(result)
    contracts = []
    result.auction_result_contracts.each do |result_contract|
      company_user_count = Consumption.get_company_user_duration_count(result_contract.auction_id, result_contract.contract_duration)
      my_result = get_result(result_contract)
      contracts.push({
                         contract_period: "#{result_contract.contract_duration} months: #{result.contract_period_start_date.strftime('%d %b %Y')} to #{result_contract.contract_period_end_date.strftime('%d %b %Y')}",
                         published_gid: result_contract.auction.published_gid,
                         name: result_contract.auction.name,
                         start_datetime: result_contract.auction.start_datetime,
                         my_result: my_result,
                         award: get_new_award(company_user_count, result_contract, result_contract.contract_duration),
                         id: Arrangement.auction_of_current_user(result_contract.auction.id, current_user.id).first.id,
                         auction_id: result.auction.id
                     })
    end

    data = {id: Arrangement.auction_of_current_user(result.auction.id, current_user.id).first.id, auction_id: result.auction.id,
            published_gid: result.auction.published_gid, name: result.auction.name, start_datetime: result.auction.start_datetime,
            contracts: contracts}
    data
  end

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

  def get_award(company_user_count, result, contract_duration)
    if contract_duration.blank?
      company_user_count != 0 && show_award?(result, current_user) ? ["retailer/auctions/#{result.auction_id}/award"] : []
    else
      company_user_count != 0 && show_award?(result, current_user) ? ["retailer/auctions/#{result.auction_id}/award?contract_duration=#{contract_duration}"] : []
    end

  end

  def get_new_award(company_user_count, result, contract_duration)
    if contract_duration.blank?
      company_user_count != 0 && show_award?(result, current_user) ? "retailer/auctions/#{result.auction_id}/award" : ''
    else
      company_user_count != 0 && show_award?(result, current_user) ? "retailer/auctions/#{result.auction_id}/award?contract_duration=#{contract_duration}" : ''
    end

  end
end
