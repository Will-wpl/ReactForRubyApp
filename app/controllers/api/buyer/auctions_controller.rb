class Api::Buyer::AuctionsController < Api::AuctionsController
  before_action :buyer_required

  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if Arrangement.auction_of_current_user(auction.id, current_user.id).exists?
        render json: { id: auction.id, publish_status: auction.publish_status }, status: 200
      else
        render json: { message: 'you can not get the auction information.' }, status: 400
      end
    end
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      # consumption = Consumption.includes(:auction).where(auctions: { publish_status: '1' }).page(params[:page_index]).per(params[:page_size])
      consumption = Consumption.find_buyer_result_auction.mine(current_user.id).find_notify_buyer.where(search_where_array).page(params[:page_index]).per(params[:page_size])
      total = consumption.total_count
    else
      consumption = Consumption.mine(current_user.id)
      total = consumption.count
    end
    headers = [
      { name: 'Name', field_name: 'name', table_name: 'auctions' },
      { name: 'Date/Time', field_name: 'actual_begin_time', table_name: 'auctions' },
      { name: 'Auction Status', field_name: 'publish_status', table_name: 'auctions' },
      { name: 'Status of Participation', field_name: 'participation_status', table_name: 'consumptions' },
      { name: nil, field_name: 'actions', is_sort: false }
    ]
    actions = [{ url: '/buyer/consumptions/:id/edit', name: 'Manage', icon: 'manage', check: 'docheck' },
               { url: '/buyer/consumptions/:id/edit', name: 'View', icon: 'view', check: 'docheck' }]
    data = []
    consumptions = get_order_list(params, headers, consumption)
    consumptions.each do |consumption|
      action = get_action(consumption)
      data.push(id: consumption.id, name: consumption.auction.name, actual_begin_time: consumption.auction.actual_begin_time,
                publish_status: consumption.auction.publish_status, participation_status: consumption.participation_status,
                actions: action)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def pdf
    auction_id = params[:id]
    auction = Auction.find_by id: auction_id
    auction_result = AuctionResult.find_by_auction_id(auction_id)

    param = {
      :auction => auction,
      :auction_result => auction_result,
      :current_user => current_user
    }
    pdf_filename, output_filename = BuyerReport.new(param).pdf
    send_data IO.read(Rails.root.join(pdf_filename)), filename: output_filename
    File.delete Rails.root.join(pdf_filename)
  end

  def letter_of_award_pdf
    params[:user_id] = current_user.id
    params[:auction_id] = params[:id]
    super
  end

  private

  def get_order_list(params, headers, consumption)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      consumption.order(order_by_string)
    else
      consumption.order('auctions.actual_begin_time asc')
     end
  end

  def get_action(consumption)
    if consumption.auction.publish_status == '1' then
      1
    else
      consumption.participation_status != '1' ? 0 : 1
    end
  end
end
