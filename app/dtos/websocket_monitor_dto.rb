class WebsocketMonitorDto
  attr_accessor :logged_in_status, :logged_in_last_time, :ws_connected_status, :ws_connected_last_time, :ws_send_message_status, :ws_send_message_last_time, :current_ip

  def initialize(options = {})
    @logged_in_status = options['logged_in_status']
    @logged_in_last_time = options['logged_in_last_time']
    @ws_connected_status = options['ws_connected_status']
    @ws_connected_last_time = options['ws_connected_last_time']
    @ws_send_message_status = options['ws_send_message_status']
    @ws_send_message_last_time = options['ws_send_message_last_time']
    @current_ip = options['current_ip']
  end
end