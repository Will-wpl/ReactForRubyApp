class Api::RegistrationsController < Api::BaseController
  before_action :set_user



  def model_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :company_name,
                                 :company_name, :approval_status, :company_address,
                                 :company_unique_entity_number, :company_license_number, :account_fin,
                                 :account_mobile_number, :account_office_number, :account_home_number,
                                 :account_housing_type, :account_home_address, :gst_no, :billing_address,
                                 :agree_seller_buyer, :agree_buyer_revv, :agree_seller_revv, :has_tenants )
  end

  protected

  def add_user_log(user)
    user_updated_log = UserUpdatedLog.new
    user_updated_log.name = user.name
    user_updated_log.email =  user.email
    user_updated_log.company_name =  user.company_name
    user_updated_log.approval_status =  user.approval_status
    user_updated_log.consumer_type =  user.consumer_type
    user_updated_log.company_address =  user.company_address
    user_updated_log.company_unique_entity_number =  user.company_unique_entity_number
    user_updated_log.company_license_number =  user.company_license_number
    user_updated_log.account_fin =  user.account_fin
    user_updated_log.account_mobile_number =  user.account_mobile_number
    user_updated_log.account_office_number =  user.account_office_number
    user_updated_log.account_home_number =  user.account_home_number
    user_updated_log.account_housing_type =  user.account_housing_type
    user_updated_log.account_home_address =  user.account_home_address
    user_updated_log.comment =  user.comment
    user_updated_log.billing_address =  user.billing_address
    user_updated_log.gst_no =  user.gst_no
    user_updated_log.created_at = DateTime.current #user.created_at
    user_updated_log.users_id =  user.id
    user_updated_log.save!
  end

  # get buyer registration information
  def get_buyer_by_id(user)
    # get the last uploaded business file
    user_attachment = UserAttachment.find_last_by_type_user(user.id, UserAttachment::FileType_Buyer_Doc)
    # get uploaded business files
    user_attachments = UserAttachment.find_by_type_user(UserAttachment::FileType_Buyer_Doc, user.id).order(updated_at: :desc)
    # get buyer entities
    buyer_entities = user.company_buyer_entities.order(is_default: :desc)
    buyer_entity_ids = []
    buyer_entitiy_objs = []
    buyer_entities.each { |x|
      buyer_entity_ids.push(x.id)
      buyer_entitiy_objs.push(get_entity_info(x))
    }
    # get used buyer entities
    used_buyer_entity_ids = []
    ConsumptionDetail.all().each { |x| used_buyer_entity_ids.push(x.company_buyer_entity_id) if buyer_entity_ids.include?(x.company_buyer_entity_id) }
    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
    # get buyer-revv-t&c document
    buyer_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
    # get letter-of-authorisation document
    # letter_of_authorisation_attachment = UserAttachment.find_list_by_type(UserAttachment::FileType_Letter_Authorisation).where("file_path like '%.zip'")

    # get letter-of-authorisation (buyer) document
    letter_of_authorisation_attachment_buyer = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation_Buyer)

    # get letter-of-authorisation (retailer) document
    letter_of_authorisation_attachment_retailer = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation_Retailer)
    # get logs
    user_logs = UserUpdatedLog.find_by_user_id(user.id)
    # return json
    user_json = { user_base_info: user,
                  buyer_entities: buyer_entitiy_objs,
                  used_buyer_entity_ids: used_buyer_entity_ids,
                  self_attachment: user_attachment,
                  self_attachments: user_attachments,
                  seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                  buyer_revv_tc_attachment: buyer_revv_tc_attachment,
                  # letter_of_authorisation_attachment: letter_of_authorisation_attachment,
                  letter_of_authorisation_attachment_buyer: letter_of_authorisation_attachment_buyer,
                  letter_of_authorisation_attachment_retailer: letter_of_authorisation_attachment_retailer,
                  user_logs: user_logs}
    user_json
  end

  def get_entity_info(buyer_entity)
    {
        id: buyer_entity.id,
        company_name: buyer_entity.company_name,
        company_uen: buyer_entity.company_uen,
        company_address: buyer_entity.company_address,
        billing_address: buyer_entity.billing_address,
        bill_attention_to: buyer_entity.bill_attention_to,
        contact_name: buyer_entity.contact_name,
        contact_email: buyer_entity.contact_email,
        contact_mobile_no: buyer_entity.contact_mobile_no,
        contact_office_no: buyer_entity.contact_office_no,
        user_id: buyer_entity.user_id,
        is_default: buyer_entity.is_default,
        approval_status: buyer_entity.approval_status,
        user_entity_id: buyer_entity.user_entity_id,
        created_at: buyer_entity.created_at,
        updated_at: buyer_entity.updated_at,
        entity_logs: CompanyBuyerEntitiesUpdatedLog.where(entity_id: buyer_entity.id).order(created_at: :desc)
    }
  end
  def get_retailer_by_id(user_id)
    # get the last updated attachment
    user_attachment = UserAttachment.find_last_by_type_user(user_id, UserAttachment::FileType_Retailer_Doc)
    # get the last updated attachments
    user_attachments = UserAttachment.find_by_type_user(UserAttachment::FileType_Retailer_Doc, user_id).order(updated_at: :desc)

    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)

    # get buyer-revv-t&c document
    seller_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)

    # # get letter-of-authorisation document
    # letter_of_authorisation_attachment = UserAttachment.find_list_by_type(UserAttachment::FileType_Letter_Authorisation).where("file_path like '%.zip'")

    # get letter-of-authorisation (buyer) document
    letter_of_authorisation_attachment_buyer = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation_Buyer)

    # get letter-of-authorisation (retailer) document
    letter_of_authorisation_attachment_retailer = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation_Retailer)
    # get logs
    user_logs = UserUpdatedLog.find_by_user_id(user_id)
    # get user info
    user = User.find(user_id)
    # return json
    user_json = { user_base_info: user,
                  self_attachment: user_attachment,
                  self_attachments: user_attachments,
                  seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                  seller_revv_tc_attachment: seller_revv_tc_attachment,
                  # letter_of_authorisation_attachment: letter_of_authorisation_attachment,
                  letter_of_authorisation_attachment_buyer: letter_of_authorisation_attachment_buyer,
                  letter_of_authorisation_attachment_retailer: letter_of_authorisation_attachment_retailer,
                  user_logs: user_logs }
    user_json
  end

  def validate_user_field(field_name, field_value, except_ids, role = nil)
    users = User.where(field_name.to_s => field_value)
                .where.not(id: except_ids)

    users = if role == 'Buyer'
              users.includes(:roles).where(roles: { name: 'buyer' })
            elsif role == 'Retailer'
              users.includes(:roles).where(roles: { name: 'retailer' })
            else
              users
            end

    users.empty?
  end

  # Remove password & password_confirm if update existed user
  def filter_user_password(params)
    update_user_params = params
    if update_user_params[:password].blank?
      update_user_params.delete('password')
      update_user_params.delete('password_confirmation')
    end
    update_user_params
  end

  def set_user
    @user = current_user
  end
end
