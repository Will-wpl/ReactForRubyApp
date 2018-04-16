class Api::Admin::ConsumptionDetailsController < Api::ConsumptionDetailsController
  before_action :admin_required
end
