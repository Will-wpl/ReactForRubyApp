class Api::AuctionHistoriesController < ApplicationController

  def show
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and user_id = ?', params[:auction_id], params[:user_id]).order(bid_time: :asc)
    render json: @histories, status: 200
  end

end
