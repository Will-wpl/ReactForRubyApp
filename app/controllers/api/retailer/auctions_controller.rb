class Api::Retailer::AuctionsController < Api::AuctionsController
  before_action :retailer_required
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
end
