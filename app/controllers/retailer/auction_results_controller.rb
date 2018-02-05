class Retailer::AuctionResultsController < Retailer::BaseController
  before_action :retailer_approved_required
  def index
    @auction_results = AuctionResult.select('auction_results.* , auctions.name , auctions.start_datetime')
                                    .joins(auction: :arrangements).where('arrangements.user_id = ?', current_user.id).order(created_at: :desc).page(params[:page])
  end
end
