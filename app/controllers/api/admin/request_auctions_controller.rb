class Api::Admin::RequestAuctionsController < Api::RequestAuctionsController
  before_action :admin_required

  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = RequestAuction.includes(:user).all.where(search_where_array)
      total = result.count
    else
      result = RequestAuction.includes(:user).all
      total = result.count
    end
    result = result.page(params[:page_index]).per(params[:page_size])
    headers = get_request_auction_headers1
    data = []
    unless result.blank?
      results = get_order_list(result, params, headers)
      results.each do |result|
        data.push(id: result.id, name: result.name, duration: result.duration,
                  company_name: result.user.company_name,
                  contract_period_start_date: result.contract_period_start_date,
                  buyer_type: (result.buyer_type == RequestAuction::SingleBuyerType)? 'Single':'Multiple',
                  allow_deviation: (result.allow_deviation == RequestAuction::AllowDeviation)? 'Yes':'No',
                  total_volume: result.total_volume
        )
      end
    end

    actions = [
        {url: '/admin/request_auctions/:id', name: 'Manage', icon: 'edit', interface_type: 'request_auction'}
    ]
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end
end

private

def get_request_auction_headers1
  [
      { name: 'Name', field_name: 'name', table_name: 'request_auctions' },
      { name: 'Buyer Name', field_name: 'company_name', table_name: 'users' },
      # { name: 'Contract Duration', field_name: 'duration', table_name: 'request_auctions' },
      { name: 'Start Date', field_name: 'contract_period_start_date', table_name: 'request_auctions' },
      { name: 'Single / Multiple Buyer[s]', field_name: 'buyer_type', table_name: 'request_auctions' }
  # { name: 'All Deviation', field_name: 'allow_deviation', table_name: 'request_auctions' },
  # { name: 'Total Volume', field_name: 'total_volume', table_name: 'request_auctions' }
  ]
end
