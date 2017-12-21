class Devise::PwdsController < DeviseController
  prepend_before_action :authenticate_user!
  prepend_before_action :set_minimum_password_length, only: %i[edit]
  before_action :set_user, only: %i[edit update]

  def edit; end

  def update
    update_user_params = model_params

    if update_user_params[:password].blank?
      update_user_params.delete('password')
      update_user_params.delete('password_confirmation')
    end

    if @user.update(update_user_params)
      redirect_to edit_user_registration_path, notice: "#{User.model_name.human} was successfully updated."
    else
      render :edit_account
    end
    # self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    # prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)
    #
    # resource_updated = update_resource(resource, account_update_params)
    # yield resource if block_given?
    # if resource_updated
    #   if is_flashing_format?
    #     flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
    #                     :update_needs_confirmation : :updated
    #     set_flash_message :notice, flash_key
    #   end
    #   bypass_sign_in resource, scope: resource_name
    #   respond_with resource, location: after_update_path_for(resource)
    # else
    #   clean_up_passwords resource
    #   set_minimum_password_length
    #   respond_with resource
    # end
  end

  private

  def set_user
    @user = User.find(current_user.id)
  end

  def model_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :company_name,
                                 :company_name, :approval_status, :company_address,
                                 :company_unique_entity_number, :company_license_number, :account_fin,
                                 :account_mobile_number, :account_office_number, :account_home_number,
                                 :account_housing_type, :account_home_address)
  end
end
