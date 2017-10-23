class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

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
end
