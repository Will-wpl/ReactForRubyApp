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
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      auction = Auction.im_in(current_user.id).published.where(search_where_array)
                       .page(params[:page_index]).per(params[:page_size])
      total = auction.total_count
    else
      auction = Auction.published
      total = auction.count
    end
    headers = [
      { name: 'Name', field_name: 'name' },
      { name: 'Date/Time', field_name: 'actual_begin_time' },
      { name: 'Auction Status', field_name: 'publish_status' },
      { name: 'Status of Participation', field_name: 'participation_status' }
    ]
    actions = [{ url: '/buyer/consumptions/:id/edit', name: 'Edit', icon: 'lm--icon-search', interface_type: 'auction' }]
    data = auction.order(actual_begin_time: :asc).each do |auction|
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end
end
