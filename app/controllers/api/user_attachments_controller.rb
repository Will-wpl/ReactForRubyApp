class Api::UserAttachmentsController < Api::BaseController

  # # get updated attachments
  # def updated_attachment
  #   user = current_user
  #   attachments = []
  #   if user.tc_attachment_update_flag & UserAttachment::FileFlag_Seller_Buyer_TC
  #     seller_buyer_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
  #     attachments.push({type: UserAttachment::FileType_Seller_Buyer_TC, file: seller_buyer_tc})
  #   end
  #
  #   if user.tc_attachment_update_flag & UserAttachment::FileFlag_Buyer_REVV_TC
  #     buyer_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
  #     attachments.push({type: UserAttachment::FileType_Buyer_REVV_TC, file: buyer_revv_tc})
  #   end
  #
  #   if user.tc_attachment_update_flag & UserAttachment::FileFlag_Seller_REVV_TC
  #     seller_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)
  #     attachments.push({type: UserAttachment::FileType_Seller_REVV_TC, file: seller_revv_tc})
  #   end
  #   render json: attachments, status: 200
  # end
  #
  # # reset user updated attachment flag
  # def reset_updated_attachment
  #   user = current_user
  #   user.tc_attachment_update_flag = 0
  #   user.save!
  #   render json: user, status: 200
  # end

  # get user attachments by user id
  def index
    file_type = params[:file_type]
    attachments = UserAttachment.find_by_type(file_type).where("file_path not like '%letter_authorisation.zip' ").order(created_at: :desc)
    # if params[:file_type].eql?(UserAttachment::FileType_Letter_Authorisation)
    #   removed_attachment = nil
    #   attachments.each do |attachment|
    #     removed_attachment = attachment if attachment.file_path.include? 'letter_authorisation.zip'
    #   end
    #   attachments.delete(removed_attachment) unless removed_attachment.blank?
    # end
    render json: attachments, status: 200
  end


  # create a user attachment
  def create
    # coding
    file = params[:file]
    uploader = upload_file
    attachment = UserAttachment.new
    attachment.file_name = file.original_filename #filename
    attachment.file_type = params[:file_type]
    attachment.file_path = uploader.url
    attachment.user_id = current_user.id unless current_user&.has_role?(:admin)
    attachment.consumption_detail_id = params[:consumption_detail_id] unless params[:consumption_detail_id].blank?

    attachment.save!
    # if params[:file_type].eql?(UserAttachment::FileType_Letter_Authorisation)
    #   zip_file = upload_letter_authorisation
    #   unless UserAttachment.any?{ |x| x.file_name == zip_file.filename }
    #     zip_attachment = UserAttachment.new
    #     zip_attachment.file_name = zip_file.filename
    #     zip_attachment.file_type = params[:file_type]
    #     zip_attachment.file_path = zip_file.url
    #     zip_attachment.user_id = current_user.id unless current_user&.has_role?(:admin)
    #     zip_attachment.consumption_detail_id = params[:consumption_detail_id] unless params[:consumption_detail_id].blank?
    #     zip_attachment.save!
    #   end
    # end

    if attachment.file_type.eql?(UserAttachment::FileType_Seller_Buyer_TC)
      # User.update_attachment_update_flag(User.buyers,UserAttachment::FileFlag_Seller_Buyer_TC)
      # User.update_attachment_update_flag(User.buyer_entities,UserAttachment::FileFlag_Seller_Buyer_TC)
      # User.update_attachment_update_flag(User.retailers,UserAttachment::FileFlag_Seller_Buyer_TC)
      User.update_all(agree_seller_buyer: User::AgreeSellerBuyerNo)
    end

    if attachment.file_type.eql?(UserAttachment::FileType_Buyer_REVV_TC)
      # User.update_attachment_update_flag(User.buyers,UserAttachment::FileFlag_Buyer_REVV_TC)
      # User.update_attachment_update_flag(User.buyer_entities,UserAttachment::FileFlag_Buyer_REVV_TC)
      User.update_all(agree_buyer_revv: User::AgreeBuyerRevvNo)
    end
    if attachment.file_type.eql?(UserAttachment::FileType_Seller_REVV_TC)
      # User.update_attachment_update_flag(User.retailers,UserAttachment::FileFlag_Seller_REVV_TC)
      User.update_all(agree_seller_revv: User::AgreeSellerRevvNo)
    end

    render json: attachment, status: 200
  end

  def destroy
    attachment = UserAttachment.find_by_id(params[:id])
    # file_type = attachment.file_type
    # file_name = attachment.file_name
    attachment.destroy
    # if file_type.eql?(UserAttachment::FileType_Letter_Authorisation)
    #   zip_file_name = 'letter_authorisation.zip'
    #   destination_file_path = upload_file_path(zip_file_name)
    #   download_letter_authorisatoin(destination_file_path)
    #   reset_letter_authorisatoin(destination_file_path)
    #   zip_attachments_remove(destination_file_path,[file_name])
    #   if UserAttachment.find_by_type(UserAttachment::FileType_Letter_Authorisation).count <= 1
    #     UserAttachment.where(' file_name = ? ',zip_file_name).destroy_all
    #   end
    #
    #   #upload file
    #   mounted_as = []
    #   uploader = AvatarUploader.new(UserAttachment, mounted_as)
    #   file = File.open(destination_file_path)
    #   uploader.store!(file)
    #
    # end
    render json: {result:'success'}, status: 200
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

  # def upload_letter_authorisation
  #   file = params[:file]
  #   zip_file_name = 'letter_authorisation.zip'
  #   destination_file_path = upload_file_path(zip_file_name)
  #   download_letter_authorisatoin(destination_file_path)
  #   reset_letter_authorisatoin(destination_file_path)
  #   zip_attachments(destination_file_path, [file])
  #   mounted_as = []
  #   # mounted_as.push('')
  #   uploader = AvatarUploader.new(UserAttachment, mounted_as)
  #   # uploader = AvatarUploader.new(destination_file_path)
  #   file1 = File.open(destination_file_path)
  #   uploader.store!(file1)
  #   uploader
  #   # { url: '/' + uploader.store_path(zip_file_name), filename: zip_file_name }
  # end

  # def reset_letter_authorisatoin(zip_file_local_path)
  #   letter_authorisatoin_files = UserAttachment.find_by_type(UserAttachment::FileType_Letter_Authorisation)
  #   unless letter_authorisatoin_files.blank?
  #     letter_authorisatoin_filenames = []
  #     letter_authorisatoin_files.each do |file|
  #       letter_authorisatoin_filenames.push(file.file_name)
  #     end
  #     zip_attachments_remove(zip_file_local_path,letter_authorisatoin_filenames,true)
  #   end
  # end

  # def download_letter_authorisatoin(file)
  #   require 'open-uri'
  #
  #   attachments = UserAttachment.find_list_by_type(UserAttachment::FileType_Letter_Authorisation).where("file_path like '%.zip'")
  #   unless attachments.blank?
  #     url = attachments.first.file_path
  #     open(file, 'wb') do |f|
  #       f << open(url).read
  #     end
  #   end
  # end
end
