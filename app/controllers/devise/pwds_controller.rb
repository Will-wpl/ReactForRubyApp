class Devise::PwdsController < DeviseController
  prepend_before_action :authenticate_scope!, only: %i[edit update]
  prepend_before_action :set_minimum_password_length, only: %i[edit]

  before_action :set_user, only: %i[edit update]

  def edit; end

  def update
    resource_updated = update_resource(resource, account_update_params)
    yield resource if block_given?
    if resource_updated
      bypass_sign_in resource, scope: resource_name
      redirect_to users_pwds_edit_path, notice: "#{User.model_name.human} was successfully updated."
    else
      clean_up_passwords resource
      set_minimum_password_length
      render :edit
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

  # By default we want to require a password checks on update.
  # You can overwrite this method in your own RegistrationsController.
  def update_resource(resource, params)
    resource.update_with_password(params)
  end

  # Authenticates the current scope and gets the current resource from the session.
  def authenticate_scope!
    send(:"authenticate_#{resource_name}!", force: true)
    self.resource = send(:"current_#{resource_name}")
  end

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

  def account_update_params
    devise_parameter_sanitizer.sanitize(:account_update)
  end
end
