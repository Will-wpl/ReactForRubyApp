class Retailer::AuctionResultsController < Retailer::BaseController

  def index
    @auction_results = AuctionResult.select('auction_results.* , auctions.name , auctions.start_datetime').joins(:auction).where('user_id = ?', current_user.id).order(created_at: :desc).page(params[:page])
  end


end
