class Api::Retailer::AuctionsController < Api::AuctionsController
  before_action :retailer_required
  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if Arrangement.auction_of_current_user(auction.id, current_user.id).exists?
        render json: { id: auction.id, publish_status: auction.publish_status, name: auction.name }, status: 200
      else
        render json: { message: 'you can not get the auction information.' }, status: 400
      end
    end
  end

  # Retailer search published auction list
  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)

      arrangement = Arrangement.find_published_auction.find_notify_retailer(current_user.id).where(search_where_array).page(params[:page_index]).per(params[:page_size])
      total = arrangement.total_count
    else
      arrangement = Arrangement.find_notify_retailer(current_user.id).find_published_auction
      total = arrangement.count
    end

    headers = [
      { name: 'ID', field_name: 'id_name' },
      { name: 'Name', field_name: 'name' },
      { name: 'Date/Time', field_name: 'actual_begin_time' },
      { name: 'Auction Status', field_name: 'auction_status' },
      { name: 'My Status', field_name: 'my_status' },
      { name: nil, field_name: 'actions' }
    ]
    actions = [{ url: '/retailer/arrangements/:id/tender', name: 'Edit', icon: 'edit', interface_type: 'auction' },
               { url: '/retailer/arrangements/:id/tender', name: 'View', icon: 'view', interface_type: 'auction' },
               { url: '/retailer/auctions/:id/upcoming', name: 'Start Bidding', icon: 'bidding', interface_type: 'auction' }]
    data = []

    arrangement.order('auctions.actual_begin_time asc').each do |arrangement|
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
                auction_status: auction_status, my_status: arrangement.accept_status,
                id: arrangement.id, auction_id: arrangement.auction_id, actions: action)
    end

    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200

  end
end
