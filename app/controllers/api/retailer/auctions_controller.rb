class Api::Retailer::AuctionsController < Api::AuctionsController
  before_action :retailer_required
  def obtain
    if Auction.count == 0
      render json: nil
    else
      @auction = Auction.first
      render json: {id: @auction.id, publish_status: @auction.publish_status}, status: 200
    end
  end
end
