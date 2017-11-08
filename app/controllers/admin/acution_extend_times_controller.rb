class Admin::AcutionExtendTimesController < Admin::BaseController
  before_action :set_acution_extend_time, only: [:show, :edit, :update, :destroy]

  before_action :set_acution_extend_times_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @acution_extend_times = AcutionExtendTime.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @acution_extend_time = AcutionExtendTime.new
  end

  def create
    @acution_extend_time = AcutionExtendTime.new(model_params)

    if @acution_extend_time.save
      redirect_to [:admin, @acution_extend_time], notice: "#{AcutionExtendTime.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @acution_extend_time.update(model_params)
      redirect_to [:admin, @acution_extend_time], notice: "#{AcutionExtendTime.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @acution_extend_time.destroy

    redirect_to admin_acution_extend_times_path, notice: "#{AcutionExtendTime.model_name.human} was successfully destroyed."
  end

  private

    def set_acution_extend_time
      @acution_extend_time = AcutionExtendTime.find(params[:id])
    end

    def model_params
      params.require(:acution_extend_time).permit(:extend_time, :current_time, :actual_begin_time, :actual_end_time)
    end

    def set_acution_extend_times_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb AcutionExtendTime.model_name.human.pluralize, admin_acution_extend_times_path
      add_breadcrumb @acution_extend_time.name_was, admin_acution_extend_time_path(@acution_extend_time) if @acution_extend_time.try(:persisted?)
    end
end
