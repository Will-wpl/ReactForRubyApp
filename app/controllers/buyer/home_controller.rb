class Buyer::HomeController < Buyer::BaseController
  def index
    UserExtension.save_or_update_login_status(current_user, 'login', '', request[:action])
    @current_user = User.find(current_user.id)
  end
end
