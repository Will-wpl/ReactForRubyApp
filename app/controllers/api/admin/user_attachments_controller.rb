class Api::Admin::UserAttachmentsController < Api::UserAttachmentsController
  before_action :admin_required

  def find_last_by_type
    file_type = params[:file_type]
    attachment = UserAttachment.find_by_type(file_type).order(created_at: :desc).first
    render json: attachment, status: 200
  end
end
