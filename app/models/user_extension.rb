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
    UserExtension.find_or_create_by(user: user).update(
      login_status: login_status,
      current_room: current_room,
      current_page: current_page
    )
  end
end
