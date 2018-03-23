class Admin::AuctionResultsController < Admin::BaseController
  def index
    @auction_results_count = AuctionResult.left_outer_joins(:auction).count
  end
end
