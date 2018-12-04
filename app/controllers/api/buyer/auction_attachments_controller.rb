class Api::Buyer::AuctionAttachmentsController < Api::AuctionAttachmentsController
  before_action :buyer_required
end
