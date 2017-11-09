class Admin::UserExtensionsController < Admin::BaseController
  before_action :set_user_extension, only: [:show, :edit, :update, :destroy]

  before_action :set_user_extensions_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @user_extensions = UserExtension.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @user_extension = UserExtension.new
  end

  def create
    @user_extension = UserExtension.new(model_params)

    if @user_extension.save
      redirect_to [:admin, @user_extension], notice: "#{UserExtension.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @user_extension.update(model_params)
      redirect_to [:admin, @user_extension], notice: "#{UserExtension.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @user_extension.destroy

    redirect_to admin_user_extensions_path, notice: "#{UserExtension.model_name.human} was successfully destroyed."
  end

  private

    def set_user_extension
      @user_extension = UserExtension.find(params[:id])
    end

    def model_params
      params.require(:user_extension).permit(:login_status, :current_room, :current_page)
    end

    def set_user_extensions_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb UserExtension.model_name.human.pluralize, admin_user_extensions_path
      add_breadcrumb @user_extension.name_was, admin_user_extension_path(@user_extension) if @user_extension.try(:persisted?)
    end
end
