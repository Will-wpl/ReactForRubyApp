class Api::AuctionHistoriesController < Api::BaseController
  before_action :retailer_required, only: %i[show]
end
