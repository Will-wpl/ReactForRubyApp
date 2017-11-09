class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # for csrf ,do not open it
  # protect_from_forgery unless: -> { request.format.json? }
  # before_action :authenticate_user!
  before_action :basic_authenticate
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def basic_authenticate
    return if [ENV['BASIC_AUTH_USER'], ENV['BASIC_AUTH_PASSWORD']].any?(&:blank?)

    authenticate_or_request_with_http_basic('basement') do |username, password|
      ActiveSupport::SecurityUtils.secure_compare(username, ENV['BASIC_AUTH_USER']) &&
        ActiveSupport::SecurityUtils.secure_compare(password, ENV['BASIC_AUTH_PASSWORD'])
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up,        keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def set_action_breadcrumbs
    case params[:action]
    when 'new', 'create'
      add_breadcrumb 'New'
    when 'edit', 'update'
      add_breadcrumb 'Edit'
    end
  end

  def after_sign_in_path_for(resource)
    roleName = current_user.roles.first.name
    if roleName == 'admin'
      stored_location_for(resource) || admin_home_index_path
    elsif roleName == 'retailer'
      stored_location_for(resource) || retailer_home_index_path
    else
    
    end
  end

  def after_sign_out_path_for(resource)
    root_url
  end
end
