class AuctionChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "auction_#{params[:auction_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    update_check_params('off-live')
  end

  def check_in
    update_check_params('on-live')
  end

  private

  def update_check_params(login_status)
    @arrangement = Arrangement.where('auction_id = :auction_id and user_id = :user_id', auction_id: params[:auction_id], user_id: params[:user_id])
    @arrangement.update(login_status: login_status)
  end
end
