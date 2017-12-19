class Admin::UsersController < Admin::BaseController
  before_action :set_user, only: %i[show edit update destroy]

  before_action :set_users_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @users = User.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new model_params

    if @user.save
      redirect_to [:admin, @user], notice: "#{User.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show; end

  def edit; end

  def update
    # Update without providing a password
    update_user_params = model_params

    if update_user_params[:password].blank?
      update_user_params.delete('password')
      update_user_params.delete('password_confirmation')
    end

    if @user.update(update_user_params)
      redirect_to [:admin, @user], notice: "#{User.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @user.destroy

    redirect_to admin_users_path, notice: "#{User.model_name.human} was successfully destroyed."
  end

  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    @users = User.retailers.order(created_at: :desc).page(params[:page])
  end

  # user.user_detail.consumer_type['0', '1'] '0':company '1':individual
  def buyers
    @users = User.buyers.order(created_at: :desc).page(params[:page])
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def model_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :company_name, role_ids: [])
  end

  def set_users_breadcrumbs
    add_breadcrumb 'Home', root_path
    add_breadcrumb User.model_name.human.pluralize, admin_users_path
    add_breadcrumb @user.name_was, admin_user_path(@user) if @user.try(:persisted?)
  end
end
