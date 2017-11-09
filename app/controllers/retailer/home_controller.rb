class Retailer::HomeController < ApplicationController
  def index
    UserExtension.save_or_update_login_status(current_user, 'login', '', request[:action])
  end
end
