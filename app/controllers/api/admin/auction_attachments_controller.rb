class Api::Admin::AuctionAttachmentsController < Api::AuctionAttachmentsController
  before_action :admin_required
end
