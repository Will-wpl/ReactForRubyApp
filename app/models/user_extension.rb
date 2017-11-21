class UserExtension < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.save_or_update_login_status(user, login_status, current_room, current_page)
    if user.user_extension.nil?
      # new
      ue = UserExtension.new
      ue.user_id = user.id
      ue.login_status = login_status
      ue.current_page = current_page
      ue.current_room = current_room
      ue.save
    else
      # update
      ue = user.user_extension
      # ue = UserExtension.find_by_user_id(user.id)
      if ue.update(login_status: login_status, current_room: current_room, current_page: current_page)
        puts 'updated'
      end

    end
  end
end
