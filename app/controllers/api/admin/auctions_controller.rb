class Api::Admin::AuctionsController < Api::AuctionsController
  before_action :admin_required
  before_action :set_auction, only: %i[update publish hold confirm]
end
