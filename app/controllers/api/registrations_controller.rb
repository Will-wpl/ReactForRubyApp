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

  def validate_user_field(field_name, field_value, except_ids)
    check_result = User.where(field_name + ' = \'' + field_value + '\'').where(' id not in (?)', except_ids).blank?
    message = field_name + ' is exist. please change it' unless check_result
    [message.blank?, message]
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
