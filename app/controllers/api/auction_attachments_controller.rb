class Api::AuctionAttachmentsController < Api::BaseController

  # get auction attachments by auction id
  def index
    auction_id = params[:auction_id]
    # attachments = Auction.find(auction_id).auction_attachments
    attachments = AuctionAttachment.belong_auction(auction_id)
    render json: attachments, status: 200
  end

  # create a auction attachment by auction id
  def create
    # coding
    file = params[:file]
    tmp_file_name = file.original_filename
    file.original_filename = Time.current.to_i.to_s
    uploader = AvatarUploader.new(AuctionAttachment, params[:auction_id])
    uploader.store!(file)
    attachment = AuctionAttachment.new
    attachment.auction_id = params[:auction_id]
    attachment.file_name = tmp_file_name
    attachment.file_type = params[:file_type]
    if params[:user_id].nil?
      attachment.file_path = uploader.store_dir + '/' + file.original_filename
    else
      attachment.user_id = params[:user_id]
      attachment.file_path = uploader.store_dir + "/#{params[:user_id]}" + file.original_filename
    end

    attachment.save
    render json: attachment, status: 200
  end

  def destroy
    attachment = AuctionAttachment.find(params[:id])
    attachment.destroy
    render json: nil, status: 200
  end
end
