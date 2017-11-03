class Admin::AuctionsController < Admin::BaseController
  before_action :set_auction, only: [:show, :edit, :update, :destroy, :publish]

  before_action :set_auctions_breadcrumbs
  before_action :set_action_breadcrumbs

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

  # GET result page
  def result; end

  # GET report page
  def report; end

  # GET log page
  def log; end


  # default create
  # def create
  #   @auction = Auction.new(model_params)

  #   if @auction.save
  #     redirect_to [:admin, @auction], notice: "#{Auction.model_name.human} was successfully created."
  #   else
  #     render :new
  #   end
  # end

  # def show
  # end
  #
  # def edit
  # end
  #
  # def update
  #   if @auction.update(model_params)
  #     redirect_to [:admin, @auction], notice: "#{Auction.model_name.human} was successfully updated."
  #   else
  #     render :edit
  #   end
  # end

  # def destroy
  #   @auction.destroy

  #   redirect_to admin_auctions_path, notice: "#{Auction.model_name.human} was successfully destroyed."
  # end

  private

  def set_auction
    @auction = Auction.find(params[:id])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price)
  end

  def set_auctions_breadcrumbs
    add_breadcrumb 'Home', admin_home_index_path
    add_breadcrumb Auction.model_name.human.pluralize, admin_auctions_path
    add_breadcrumb @auction.name_was, admin_auction_path(@auction) if @auction.try(:persisted?)
  end
end
