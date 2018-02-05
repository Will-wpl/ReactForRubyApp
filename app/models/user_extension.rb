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

  def self.websocket_monitor(user, ws_monitor)
    UserExtension.find_or_create_by(user: user).update(
      logged_in_status: ws_monitor.logged_in_status,
      logged_in_last_time: ws_monitor.logged_in_last_time,
      ws_connected_status: ws_monitor.ws_connected_status,
      ws_connected_last_time: ws_monitor.ws_connected_last_time,
      ws_send_message_status: ws_monitor.ws_send_message_status,
      ws_send_message_last_time: ws_monitor.ws_send_message_last_time,
      current_ip: ws_monitor.current_ip
    )
  end
end
