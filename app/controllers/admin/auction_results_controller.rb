class Admin::AuctionResultsController < Admin::BaseController

  def index
    @auction_results = AuctionResult.select('auction_results.* , auctions.name , auctions.start_datetime ').left_outer_joins(:auction).order(created_at: :desc).page(params[:page])
  end

end
