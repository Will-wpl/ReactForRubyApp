class Api::Retailer::AuctionsController < Api::AuctionsController
  before_action :retailer_required
  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if Arrangement.auction_of_current_user(auction.id, current_user.id).exists?

        # if two volumes of one intake level are 0, then no need to handle this field during whole auction process.
        has_lt = !is_zero(auction.total_lt_peak, auction.total_lt_off_peak)
        has_hts = !is_zero(auction.total_hts_peak, auction.total_hts_off_peak)
        has_htl = !is_zero(auction.total_htl_peak, auction.total_htl_off_peak)
        has_eht = !is_zero(auction.total_eht_peak, auction.total_eht_off_peak)

        render json: { id: auction.id, publish_status: auction.publish_status, name: auction.name, retailer_mode: auction.retailer_mode,
                       has_lt: has_lt, has_hts: has_hts, has_htl: has_htl, has_eht: has_eht, starting_price: auction.starting_price }, status: 200
      else
        render json: { message: 'you can not get the auction information.' }, status: 400
      end
    end
  end

  # Retailer search published auction list
  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)

      arrangement = Arrangement.find_published_result_auction.find_notify_retailer(current_user.id).where(search_where_array).page(params[:page_index]).per(params[:page_size])
      total = arrangement.total_count
    else
      arrangement = Arrangement.find_published_result_auction.find_notify_retailer(current_user.id)
      total = arrangement.count
    end

    headers = [
      { name: 'ID', field_name: 'id', table_name:'auctions' },
      { name: 'Name', field_name: 'name', table_name:'auctions' },
      { name: 'Date/Time', field_name: 'actual_begin_time', table_name:'auctions' },
      { name: 'Auction Status', field_name: 'status', table_name:'auctions' },
      { name: 'My Status', field_name: 'my_status', is_sort: false },
      { name: nil, field_name: 'actions', is_sort: false }
    ]
    actions = [{ url: '/retailer/arrangements/:id/tender', name: 'Manage', icon: 'manage', interface_type: 'auction', check:'docheck' },
               { url: '/retailer/arrangements/:id/tender', name: 'View', icon: 'view', interface_type: 'auction', check:'docheck' },
               { url: '/retailer/auctions/:id/gotobid', name: 'Start Bidding', icon: 'bidding', interface_type: 'auction' }]
    data = []
    arrangements = if params.key?(:sort_by)
                     order_by_string = get_order_by_string(params[:sort_by])
                     arrangement.order(order_by_string)
                   else
                     arrangement.order('auctions.actual_begin_time asc')
                   end
    arrangements.each do |arrangement|
      auction_status = 'In Progress'
      action = 1
      if Time.current < arrangement.auction.actual_begin_time
        auction_status = 'Upcoming'
        action = 0
      # before admin confirm winners status is Upcoming
      # elsif Time.current >= arrangement.auction.actual_begin_time && Time.current <= arrangement.auction.acutal_end_time
      #   'In Progress'
      end

      data.push(id_name: arrangement.auction.published_gid, name: arrangement.auction.name, actual_begin_time: arrangement.auction.actual_begin_time,
                status: auction_status, my_status: arrangement.accept_status,
                id: arrangement.id, auction_id: arrangement.auction_id, actions: action)
    end

    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200

  end

  # @param [Object] intake_peak
  # @param [Object] intake_off_peak
  def is_zero(intake_peak, intake_off_peak)
    is_zero = false
    is_zero = true if intake_peak == 0 && intake_off_peak == 0
    is_zero
  end
end
