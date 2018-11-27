class Api::Buyer::RequestAuctionsController < Api::RequestAuctionsController
  before_action :buyer_required

end
