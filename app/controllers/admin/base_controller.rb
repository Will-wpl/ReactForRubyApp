class Admin::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :admin_required

  layout 'admin'

  private

  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end

  def super_admin_required
    head :unauthorized unless current_user&.has_role?(:super_admin)
  end

end
