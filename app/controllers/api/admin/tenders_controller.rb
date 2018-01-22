class Api::Admin::TendersController < Api::TendersController
  before_action :admin_required
end
