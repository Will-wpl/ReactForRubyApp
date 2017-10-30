class Admin::AuctionsController < Admin::BaseController
  before_action :set_auction, only: [:show, :edit, :update, :destroy]

  before_action :set_auctions_breadcrumbs
  before_action :set_action_breadcrumbs
  # skip_before_action :verify_authenticity_token, :except => [:publish]

  def index
    @auctions = Auction.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @auction = Auction.new
  end

  def create
    @auction = Auction.new(model_params)

    if @auction.save
      redirect_to [:admin, @auction], notice: "#{Auction.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @auction.update(model_params)
      redirect_to [:admin, @auction], notice: "#{Auction.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @auction.destroy

    redirect_to admin_auctions_path, notice: "#{Auction.model_name.human} was successfully destroyed."
  end

  # GET upcoming page
  def upcoming
  end

  # GET online page
  def online
  end

  # GET dashbard page
  def dashboard
    
  end

  # POST publish auction
  def publish
    @hello = params['hello']
    render json: @hello , status: 200
    
  end

  # POST hold auction
  def hold
  end

  # POST extend time
  def delay
    
  end

  # POST comfirm
  def comfirm
  end

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
