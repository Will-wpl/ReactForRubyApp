class Api::Admin::AuctionsController < Api::AuctionsController
  before_action :admin_required
end
