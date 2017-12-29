class Retailer::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :retailer_required

  protected

  def retailer_could_access
    head :unauthorized unless Arrangement.auction_of_current_user(params[:id], current_user.id).exists?
  end

  def retailer_approved_required
    head :unauthorized unless current_user&.has_role?(:retailer) && current_user.approval_status == '1'
  end

  private

  def retailer_required
    head :unauthorized unless current_user&.has_role?(:retailer)
  end
end
