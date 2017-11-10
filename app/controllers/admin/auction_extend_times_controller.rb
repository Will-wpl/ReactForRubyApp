class Admin::AuctionExtendTimesController < Admin::BaseController
  # before_action :set_auction_extend_time, only: [:show, :edit, :update, :destroy]
  #
  # before_action :set_auction_extend_times_breadcrumbs
  # before_action :set_action_breadcrumbs
  #
  # def index
  #   @auction_extend_times = AuctionExtendTime.all.order(created_at: :desc).page(params[:page])
  # end
  #
  # def new
  #   @auction_extend_time = AuctionExtendTime.new
  # end
  #
  # def create
  #   @auction_extend_time = AuctionExtendTime.new(model_params)
  #
  #   if @auction_extend_time.save
  #     redirect_to [:admin, @auction_extend_time], notice: "#{AuctionExtendTime.model_name.human} was successfully created."
  #   else
  #     render :new
  #   end
  # end
  #
  # def show
  # end
  #
  # def edit
  # end
  #
  # def update
  #   if @auction_extend_time.update(model_params)
  #     redirect_to [:admin, @auction_extend_time], notice: "#{AuctionExtendTime.model_name.human} was successfully updated."
  #   else
  #     render :edit
  #   end
  # end
  #
  # def destroy
  #   @auction_extend_time.destroy
  #
  #   redirect_to admin_auction_extend_times_path, notice: "#{AuctionExtendTime.model_name.human} was successfully destroyed."
  # end
  #
  # private
  #
  #   def set_auction_extend_time
  #     @auction_extend_time = AuctionExtendTime.find(params[:id])
  #   end
  #
  #   def model_params
  #     params.require(:auction_extend_time).permit(:extend_time, :current_time, :actual_begin_time, :actual_end_time)
  #   end
  #
  #   def set_auction_extend_times_breadcrumbs
  #     add_breadcrumb 'Home', root_path
  #     add_breadcrumb AuctionExtendTime.model_name.human.pluralize, admin_auction_extend_times_path
  #     add_breadcrumb @auction_extend_time.name_was, admin_auction_extend_time_path(@auction_extend_time) if @auction_extend_time.try(:persisted?)
  #   end
end
