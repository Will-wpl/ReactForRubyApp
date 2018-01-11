class Api::Buyer::AuctionAttachmentsController < Api::AuctionAttachmentsController
  before_action :buyer_required

  def download_tc
    attachment = AuctionAttachment.find_by(auction_id: params[:id], file_type: 'buyer_tc_upload0')
    render json: attachment, status: 200
  end
end
