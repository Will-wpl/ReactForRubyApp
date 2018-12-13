class Api::Buyer::TendersController < Api::TendersController
  before_action :buyer_required
  before_action :set_arrangement, only: %i[node3_admin node4_admin_accept node4_admin_reject node4_admin]
end
