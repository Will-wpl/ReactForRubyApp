class Admin::AuctionsController < Admin::BaseController
  after_action :set_login_status, only: %i[new empty upcoming online dashboard confirm result report log]
  # before_action :set_auctions_breadcrumbs
  # before_action :set_action_breadcrumbs

  # GET create auction page
  def new; end

  # GET empty page
  def empty; end

  # GET upcoming page
  def upcoming; end

  # GET online page
  def online; end

  # GET dashbard page
  def dashboard; end

  # GET confirm page
  def confirm; end

  # GET choose winner page
  def choose_winner; end

  # GET result page
  def result
    @company_count = Consumption.get_company_user_count(params[:id])
    @live_auction_contracts = get_lived_auction_contracts(Auction.find(params[:id]), true)
  end

  # GET report page
  def report; end

  # GET log page
  def log; end
  #   @auction_events = AuctionEvent.select('auction_events.* , users.company_name ').left_outer_joins(:user).order(created_at: :desc).page(params[:page])
  # end

  def award; end

  # def goto
  #   if @auction.publish_status != '1'
  #     redirect_to empty_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && Time.current < @auction.actual_begin_time
  #     redirect_to upcoming_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time && !@auction.hold_status
  #     redirect_to dashboard_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time && @auction.hold_status
  #     redirect_to upcoming_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.current && @auction.auction_result.nil? && !@auction.hold_status
  #     redirect_to confirm_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.current && @auction.auction_result.nil? && @auction.hold_status
  #     redirect_to upcoming_admin_auction_path(@auction.id)
  #   elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.current && !@auction.auction_result.nil?
  #     redirect_to result_admin_auction_path(@auction.id)
  #   else
  #     redirect_to admin_home_index_path
  #   end
  # end

  def published; end

  def unpublished; end

  def retailer_dashboard; end

  def buyer_dashboard; end

  def contract_expiry; end

  private

  def set_auction
    @auction = Auction.find(params[:id])
  end

  def set_login_status
    UserExtension.save_or_update_login_status(current_user, 'login', params[:id], request[:action])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price)
  end
end
