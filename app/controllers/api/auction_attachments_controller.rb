class Api::AuctionAttachmentsController < Api::BaseController

  # get auction attachments by auction id
  def index
    auction_id = params[:auction_id]
    attachments = AuctionAttachment.belong_auction(auction_id)
    render json: attachments, status: 200
  end

  # create a auction attachment by auction id
  def create
    # coding
    file = params[:file]
    mounted_as = [params[:auction_id]]
    mounted_as.push(params[:user_id]) unless params[:user_id].nil?
    uploader = AvatarUploader.new(AuctionAttachment, mounted_as)
    uploader.store!(file)
    attachment = AuctionAttachment.new
    attachment.auction_id = params[:auction_id]
    attachment.file_name = file.original_filename
    attachment.file_type = params[:file_type]
    attachment.file_path = uploader.store_dir + '/' + file.original_filename
    attachment.user_id = params[:user_id] unless params[:user_id].nil?

    attachment.save
    render json: attachment, status: 200
  end

  def destroy
    attachment = AuctionAttachment.find(params[:id])
    attachment.destroy
    render json: nil, status: 200
  end
end
