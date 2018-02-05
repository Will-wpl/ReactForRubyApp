class Buyer::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :retailer_required

  private

  def retailer_required
    head :unauthorized unless current_user&.has_role?(:buyer)
  end
end
