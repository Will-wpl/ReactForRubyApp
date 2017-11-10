class Admin::AuctionEventsController < Admin::BaseController
  # before_action :set_auction_event, only: [:show, :edit, :update, :destroy]
  #
  # before_action :set_auction_events_breadcrumbs
  # before_action :set_action_breadcrumbs
  #
  # def index
  #   @auction_events = AuctionEvent.all.order(created_at: :desc).page(params[:page])
  # end
  #
  # def new
  #   @auction_event = AuctionEvent.new
  # end
  #
  # def create
  #   @auction_event = AuctionEvent.new(model_params)
  #
  #   if @auction_event.save
  #     redirect_to [:admin, @auction_event], notice: "#{AuctionEvent.model_name.human} was successfully created."
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
  #   if @auction_event.update(model_params)
  #     redirect_to [:admin, @auction_event], notice: "#{AuctionEvent.model_name.human} was successfully updated."
  #   else
  #     render :edit
  #   end
  # end
  #
  # def destroy
  #   @auction_event.destroy
  #
  #   redirect_to admin_auction_events_path, notice: "#{AuctionEvent.model_name.human} was successfully destroyed."
  # end
  #
  # private
  #
  #   def set_auction_event
  #     @auction_event = AuctionEvent.find(params[:id])
  #   end
  #
  #   def model_params
  #     params.require(:auction_event).permit(:auction_who, :auction_when, :auction_what)
  #   end
  #
  #   def set_auction_events_breadcrumbs
  #     add_breadcrumb 'Home', root_path
  #     add_breadcrumb AuctionEvent.model_name.human.pluralize, admin_auction_events_path
  #     add_breadcrumb @auction_event.name_was, admin_auction_event_path(@auction_event) if @auction_event.try(:persisted?)
  #   end
end
