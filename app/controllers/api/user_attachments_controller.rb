class Api::UserAttachmentsController < Api::BaseController

  # get updated attachments
  def updated_attachment
    user = current_user
    attachments = []
    if user.tc_attachment_update_flag & UserAttachment::FileFlag_Seller_Buyer_TC
      seller_buyer_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
      attachments.push({type: UserAttachment::FileType_Seller_Buyer_TC, file: seller_buyer_tc})
    end

    if user.tc_attachment_update_flag & UserAttachment::FileFlag_Buyer_REVV_TC
      buyer_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
      attachments.push({type: UserAttachment::FileType_Buyer_REVV_TC, file: buyer_revv_tc})
    end

    if user.tc_attachment_update_flag & UserAttachment::FileFlag_Seller_REVV_TC
      seller_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)
      attachments.push({type: UserAttachment::FileType_Seller_REVV_TC, file: seller_revv_tc})
    end
    render json: attachments, status: 200
  end

  # get user attachments by user id
  def index
    file_type = params[:file_type]
    attachments = UserAttachment.find_by_type(file_type).order(created_at: :desc)
    render json: attachments, status: 200
  end


  # create a user attachment
  def create
    # coding
    uploader = upload_file
    attachment = UserAttachment.new
    attachment.file_name = uploader.filename
    attachment.file_type = params[:file_type]
    attachment.file_path = uploader.url
    attachment.user_id = current_user.id unless current_user&.has_role?(:admin)
    attachment.consumption_detail_id = params[:consumption_detail_id] unless params[:consumption_detail_id].blank?

    attachment.save!

    if attachment.file_type.eql?(UserAttachment::FileType_Seller_Buyer_TC)
      User.update_attachment_update_flag(User.buyers,UserAttachment::FileFlag_Seller_Buyer_TC)
      User.update_attachment_update_flag(User.buyer_entities,UserAttachment::FileFlag_Seller_Buyer_TC)
      User.update_attachment_update_flag(User.retailers,UserAttachment::FileFlag_Seller_Buyer_TC)
    end

    if attachment.file_type.eql?(UserAttachment::FileType_Buyer_REVV_TC)
      User.update_attachment_update_flag(User.buyers,UserAttachment::FileFlag_Buyer_REVV_TC)
      User.update_attachment_update_flag(User.buyer_entities,UserAttachment::FileFlag_Buyer_REVV_TC)
    end
    if attachment.file_type.eql?(UserAttachment::FileType_Seller_REVV_TC)
      User.update_attachment_update_flag(User.retailers,UserAttachment::FileFlag_Seller_REVV_TC)
    end

    render json: attachment, status: 200
  end

  def destroy
    attachment = UserAttachment.find_by_id(params[:id])
    attachment.destroy
    render json: nil, status: 200
  end

  private

  def upload_file

    file = params[:file]
    mounted_as = []
    mounted_as.push(current_user.id.to_s) unless current_user&.has_role?(:admin)
    mounted_as.push(Time.current.to_f.to_s.delete('.'))

    uploader = AvatarUploader.new(UserAttachment, mounted_as)
    uploader.store!(file)
    uploader
  end
end
