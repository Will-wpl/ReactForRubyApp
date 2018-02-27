class Api::Retailer::ConsumptionsController < Api::ConsumptionsController
  before_action :retailer_required
end
