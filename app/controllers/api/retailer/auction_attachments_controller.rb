class Api::Retailer::AuctionAttachmentsController < Api::AuctionAttachmentsController
  before_action :retailer_required

  # get auction attachments by auction id and user_id
  def index
    auction_id = params[:auction_id]
    user_id = params[:user_id]
    attachments = AuctionAttachment.user_auction(auction_id, user_id)
    render json: attachments, status: 200
  end

end
