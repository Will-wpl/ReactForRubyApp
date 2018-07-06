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
  # # validate user base info [ duplicate -> email, UEN, Company name; ]
  # def validate_user_base_info(user)
  #   message = 'Company name is existed.' if User.duplicated_field_value('company_name',
  #                                                                       user.company_name,
  #                                                                       [user.id])
  #
  #   message = 'User email is existed.' if User.duplicated_field_value('email',
  #                                                                     user.email,
  #                                                                     [user.id])
  #
  #   message = 'Company UEN is existed.' if User.duplicated_field_value('company_unique_entity_number',
  #                                                                      user.company_unique_entity_number,
  #                                                                      [user.id])
  #   [message.blank?, message]
  # end
  def validate_user_field(field_name, field_value, except_ids)
    message = 'Company name is existed.' if User.duplicated_field_value(field_name,
                                                                      field_value,
                                                                      except_ids)
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
