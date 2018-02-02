class Retailer::HomeController < Retailer::BaseController
  def index
    UserExtension.save_or_update_login_status(current_user, 'login', '', request[:action])
    UserExtension.find_or_create_by(user: current_user).update(
      logged_in_status: '1',
      logged_in_last_time: Time.current
    )
  end
end
