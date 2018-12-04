class Api::RequestAttachmentsController < Api::BaseController

  # create a user attachment
  def create
    file = params[:file]
    unless file.blank?
      uploader = upload_file
      attachment = RequestAttachment.new
      attachment.file_name = file.original_filename #filename
      attachment.file_type = params[:file_type]
      attachment.file_path = uploader.url
      attachment.save!
    end
    render json: attachment, status: 200
  end

  private
  def upload_file
    file = params[:file]
    mounted_as = []
    mounted_as.push(current_user.id.to_s) unless current_user&.has_role?(:admin)
    mounted_as.push(Time.current.to_f.to_s.delete('.'))

    uploader = AvatarUploader.new(RequestAttachment, mounted_as)
    uploader.store!(file)
    uploader
  end
end
