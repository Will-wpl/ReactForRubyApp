class Buyer::AuctionsController < Buyer::BaseController
  after_action :set_login_status, only: %i[]

  def index; end

  # GET report page
  def report; end

  # GET letter of award page
  def award; end

  def retailer_dashboard; end
end
