class Api::Admin::AuctionHistoriesController < Api::AuctionHistoriesController
  before_action :admin_required
end
