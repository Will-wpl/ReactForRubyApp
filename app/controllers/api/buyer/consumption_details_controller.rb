class Api::Buyer::ConsumptionDetailsController < Api::ConsumptionDetailsController
  before_action :buyer_required
  before_action :set_consumption_detail, only: %i[update]
end
