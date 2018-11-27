class Api::Admin::RequestAuctionsController < Api::RequestAuctionsController
  before_action :admin_required

end
