class Api::Admin::ConsumptionDetailsController < Api::ConsumptionDetailsController
  before_action :admin_required
  before_action :set_consumption_detail, only: %i[update]
end
