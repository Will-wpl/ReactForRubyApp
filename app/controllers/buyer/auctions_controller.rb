class Buyer::AuctionsController < Buyer::BaseController
  after_action :set_login_status, only: %i[]

  def index

  end
end
