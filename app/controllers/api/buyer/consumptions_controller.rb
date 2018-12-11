class Api::Buyer::ConsumptionsController < Api::ConsumptionsController
  before_action :buyer_required
end
