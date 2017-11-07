class AuctionChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "auction_#{params[:auction_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    update_check_params('off')
  end

  def check_in
    update_check_params('on-live')
    ActionCable.server.broadcast "auction_#{params[:auction_id]}", 'hello-world'
  end

  def extend_time

  end

  def set_bid(data)
    puts params[:lt_peak]
    calculate_dto = CalculateDto.new(data['lt_peak'] ,data['lt_off_peak'],data['hts_peak'],data['hts_off_peak'], data['htl_peak'], data['htl_off_peak'], params[:auction_id], params[:user_id])
    set_price(calculate_dto)
  end

  private

  def update_check_params(login_status)
    @arrangement = Arrangement.where('auction_id = :auction_id and user_id = :user_id', auction_id: params[:auction_id], user_id: params[:user_id])
    @arrangement.update(login_status: login_status)
  end

  def set_price(calculate_dto)
    puts calculate_dto.lt_peak
  end
end
