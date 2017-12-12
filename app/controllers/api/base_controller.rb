class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end

  protected

  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end

  def retailer_required
    head :unauthorized unless current_user&.has_role?(:retailer)
  end
end
