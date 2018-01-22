class Api::Retailer::TendersController < Api::TendersController
  before_action :retailer_required
  before_action :set_arrangement, only: %i[node1_retailer node2_retailer node3_retailer node4_retailer node5_retailer]
end
