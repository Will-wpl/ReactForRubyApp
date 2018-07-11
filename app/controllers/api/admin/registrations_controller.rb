class Api::Admin::RegistrationsController < Api::RegistrationsController
  before_action :admin_required

  # get retailer registration information by user id
  def retailer_info
    user_json = get_retailer_by_id(params[:user_id])
    # return json
    render json: user_json, status: 200
  end

  # get buyer registration information by user id
  def buyer_info
    # get buyer base information
    user = User.find(params[:user_id])
    user_json = get_buyer_by_id(user)
    # return json
    render json: user_json, status: 200
  end
end