class HealthChannel < ApplicationCable::Channel
  def subscribed
    UserExtension.find_or_create_by(user: params[:user_id]).update(
      ws_connected_status: '1',
      ws_connected_last_time: Time.current
    )
  end

  def unsubscribed; end

  def heartbeat(data)
    UserExtension.find_or_create_by(user: data['user_id']).update(
      ws_send_message_status: '1',
      ws_send_message_last_time: Time.current,
      current_ip: data['public_ip4']
    )
  end
end