class Api::Admin::TendersController < Api::TendersController
  before_action :admin_required
  before_action :set_arrangement, only: %i[node4_admin_accept node4_admin_reject]
end
