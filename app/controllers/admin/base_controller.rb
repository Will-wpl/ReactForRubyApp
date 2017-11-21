class Admin::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :admin_required

  layout 'admin'

  private

  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end
end
