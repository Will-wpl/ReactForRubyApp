class Api::Admin::ConsumptionsController < Api::ConsumptionsController
  before_action :admin_required
end
