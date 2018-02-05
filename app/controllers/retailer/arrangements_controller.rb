class Retailer::ArrangementsController < Retailer::BaseController
  before_action :retailer_approved_required

  def tender; end
end
