class Api::Admin::ArrangementsController < Api::ArrangementsController
  before_action :admin_required
end
