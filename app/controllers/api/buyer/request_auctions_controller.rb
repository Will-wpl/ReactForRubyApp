class Api::Buyer::RequestAuctionsController < Api::RequestAuctionsController
  before_action :buyer_required

  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = RequestAuction.mine(current_user.id).where(search_where_array)
      total = result.count
    else
      result = RequestAuction.mine(current_user.id)
      total = result.count
    end
    result = result.page(params[:page_index]).per(params[:page_size])
    headers = get_request_auction_headers
    data = []
    unless result.blank?
      results = get_order_list(result, params, headers)
      results.each do |result|
        data.push(id: result.id, name: result.name, duration: result.duration.to_s + ' Months',
                  contract_period_start_date: result.contract_period_start_date,
                  buyer_type: (result.buyer_type == RequestAuction::SingleBuyerType)? 'Single':'Multiple',
                  allow_deviation: (result.allow_deviation == RequestAuction::AllowDeviation)? 'Yes':'No',
                  total_volume: result.total_volume,
                  updated_at: result.updated_at,
                  accept_status: result.accept_status, #(result.accept_status == RequestAuction::AcceptStatusReject)?'Rejected':(result.accept_status == RequestAuction::AcceptStatusApproved ? 'Accepted':'Pending'),

        )
      end
    end

    actions = [
        # {url: '/buyer/request_auctions/:id', name: 'Manage', icon: 'edit', interface_type: 'request_auction'}
      {url: '/buyer/request_auctions/:id', name: 'View', icon: 'view', interface_type: 'request_auction', check: 'request_buyer' }
    ]
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end
end

private
def get_request_auction_headers
  [
      { name: 'Name of Reverse Auction', field_name: 'name', table_name: 'request_auctions' },
      # { name: 'Buyer Name', field_name: 'buyer_name', table_name: 'users' },
      { name: 'Contract Start Date', field_name: 'contract_period_start_date', table_name: 'request_auctions' },
      { name: 'Contract Duration', field_name: 'duration', table_name: 'request_auctions' },
      { name: 'Single / Multiple Buyer[s]', field_name: 'buyer_type', table_name: 'request_auctions' },
      { name: 'Date / Time', field_name: 'updated_at', table_name: 'request_auctions' },
      { name: 'Status', field_name: 'accept_status', table_name: 'request_auctions' }
  # { name: 'All Deviation', field_name: 'allow_deviation', table_name: 'request_auctions' },
  # { name: 'Total Volume', field_name: 'total_volume', table_name: 'request_auctions' }
  ]
end