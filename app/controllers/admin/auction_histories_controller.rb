class Admin::AuctionHistoriesController < Admin::BaseController
  before_action :set_auction_history, only: [:show, :edit, :update, :destroy]

  before_action :set_auction_histories_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @auction_histories = AuctionHistory.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @auction_history = AuctionHistory.new
  end

  def create
    @auction_history = AuctionHistory.new(model_params)

    if @auction_history.save
      redirect_to [:admin, @auction_history], notice: "#{AuctionHistory.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @auction_history.update(model_params)
      redirect_to [:admin, @auction_history], notice: "#{AuctionHistory.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @auction_history.destroy

    redirect_to admin_auction_histories_path, notice: "#{AuctionHistory.model_name.human} was successfully destroyed."
  end

  private

    def set_auction_history
      @auction_history = AuctionHistory.find(params[:id])
    end

    def model_params
      params.require(:auction_history).permit(:average_price, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak, :user_id, :auction_id)
    end

    def set_auction_histories_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb AuctionHistory.model_name.human.pluralize, admin_auction_histories_path
      add_breadcrumb @auction_history.name_was, admin_auction_history_path(@auction_history) if @auction_history.try(:persisted?)
    end
end
