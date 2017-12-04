class Api::Retailer::AuctionHistoriesController < Api::AuctionHistoriesController
  before_action :retailer_required
end
