class AddWebsocketMonitorFieldsToUserExtensions < ActiveRecord::Migration[5.1]
  def change
    add_column :user_extensions, :logged_in_status, :string
    add_column :user_extensions, :logged_in_last_time, :datetime
    add_column :user_extensions, :ws_connected_status, :string
    add_column :user_extensions, :ws_connected_last_time, :datetime
    add_column :user_extensions, :ws_send_message_status, :string
    add_column :user_extensions, :ws_send_message_last_time, :datetime
    add_column :user_extensions, :current_ip, :string
  end
end
