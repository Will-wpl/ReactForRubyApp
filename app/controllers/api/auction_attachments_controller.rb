class Api::AuctionAttachmentsController < Api::BaseController

  # get auction attachments by auction id
  def index
    render json: nil, status: 200
  end

  # create a auction attachment by auction id
  def create
    # file = params[:file]
    # uploader = AvatarUploader.new
    #
    # uploader.store!(file)
    render json: nil, status: 200
  end
end
