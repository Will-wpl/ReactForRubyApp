class Api::Retailer::RegistrationsController < Api::RegistrationsController
  before_action :retailer_required

  # get retailer registration information
  def index
    # get the last updated attachment
    user_attachment = UserAttachment.find_last_by_user(current_user.id)
    # return json
    render json: { retailer_base_info: current_user, attachment: user_attachment }, status: 200
  end

  # update retailer registration information
  def update
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    @user.update(update_user_params)
    render json: { user: @user }, status: 200
  end

  # Complete Sign up retailer registration information
  def sign_up
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    update_user_params['approval_status'] = User::ApprovalStatusPending
    @user.update(update_user_params)
    render json: { user: @user }, status: 200
  end

end
