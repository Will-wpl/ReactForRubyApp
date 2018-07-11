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

  # get buyer registration information
  def get_buyer_by_id(user)
    # get the last uploaded business file
    user_attachment = UserAttachment.find_last_by_user(user.id)
    # get buyer entities
    buyer_entities = user.company_buyer_entities.order(updated_at: :asc)
    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
    # get buyer-revv-t&c document
    buyer_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
    # get letter-of-authorisation document
    letter_of_authorisation_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation)
    # return json
    user_json = { user_base_info: user,
                  buyer_entities: buyer_entities,
                  self_attachment: user_attachment,
                  seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                  buyer_revv_tc_attachment: buyer_revv_tc_attachment,
                  letter_of_authorisation_attachment: letter_of_authorisation_attachment}
    user_json
  end

  def get_retailer_by_id(user_id)
    # get the last updated attachment
    user_attachment = UserAttachment.find_last_by_user(user_id)

    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)

    # get buyer-revv-t&c document
    seller_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)

    # get letter-of-authorisation document
    letter_of_authorisation_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation)

    # return json
    user_json = { user_base_info: current_user,
                  self_attachment: user_attachment,
                  seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                  seller_revv_tc_attachment: seller_revv_tc_attachment,
                  letter_of_authorisation_attachment: letter_of_authorisation_attachment }
    user_json
  end

  def validate_user_field(field_name, field_value, except_ids)
    check_result = User.where(field_name + ' = \'' + field_value + '\'').where(' id not in (?)', except_ids).blank?

    check_result
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
