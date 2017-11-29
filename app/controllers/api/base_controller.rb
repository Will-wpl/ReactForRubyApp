class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end

  protected

  def is_admin
    current_user&.has_role?(:admin)
  end

  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end
end
