class Api::Buyer::ArrangementsController < Api::ArrangementsController
  before_action :buyer_required
end
