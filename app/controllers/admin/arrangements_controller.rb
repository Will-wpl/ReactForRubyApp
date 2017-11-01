class Admin::ArrangementsController < Admin::BaseController
  before_action :set_arrangement, only: [:show, :edit, :update, :destroy]

  before_action :set_arrangements_breadcrumbs
  before_action :set_action_breadcrumbs

  # GET arrangement list by auction_id
  def list
    @arrangementsList = Arrangement.select('users.company_name ,arrangements.id , arrangements.accept_status , arrangements.auction_id , arrangements.user_id ').joins(:user).where('auction_id': params[:auction_id]).order(:accept_status)
    render json: @arrangementsList, status: 200
  end

  # GET user arrangement detail info by auction_id and user_id
  def detail
    @arrangement = Arrangement.find(params[:id])
    render json: @arrangement, status: 200
  end

  def index
    @arrangements = Arrangement.order(created_at: :desc).page(params[:page])
  end

  def new
    @arrangement = Arrangement.new
  end

  def create
    @arrangement = Arrangement.new(model_params)
    # adminUser = User.find_by_name('mark')
    # auction = Auction.first
    @arrangement.user
    if @arrangement.save
      redirect_to [:admin, @arrangement], notice: "#{Arrangement.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @arrangement.update(model_params)
      redirect_to [:admin, @arrangement], notice: "#{Arrangement.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @arrangement.destroy

    redirect_to admin_arrangements_path, notice: "#{Arrangement.model_name.human} was successfully destroyed."
  end

  private

    def set_arrangement
      @arrangement = Arrangement.find(params[:id])
    end

    def model_params
      params.require(:arrangement).permit(:main_name, :main_email_address, :main_mobile_number, :main_office_number, :alternative_name, :alternative_email_address, :alternative_mobile_number, :alternative_office_number, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak)
    end

    def set_arrangements_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb Arrangement.model_name.human.pluralize, admin_arrangements_path
      add_breadcrumb @arrangement.name_was, admin_arrangement_path(@arrangement) if @arrangement.try(:persisted?)
    end
end
