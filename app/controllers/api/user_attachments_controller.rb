class Api::UserAttachmentsController < Api::BaseController

  # get user attachments by user id
  def index
    file_type = params[:file_type]
    attachments = UserAttachment.find_by_type(file_type).order(:created_at)
    render json: attachments, status: 200
  end

  # create a user attachment
  def create
    # coding
    file = params[:file]
    mounted_as = []
    mounted_as.push(current_user.id) unless current_user&.has_role?(:admin)
    mounted_as.push(Time.current.to_f.to_s.delete('.'))

    uploader = AvatarUploader.new(UserAttachment, mounted_as)
    uploader.store!(file)

    attachment = UserAttachment.new
    attachment.file_name = uploader.filename
    attachment.file_type = params[:file_type]
    attachment.file_path = uploader.url
    attachment.user_id = current_user.id unless current_user&.has_role?(:admin)

    attachment.save

    render json: attachment, status: 200
  end

  def destroy
    attachment = UserAttachment.admin_find_by_id(params[:id])
    attachment.destroy
    render json: nil, status: 200
  end
end
