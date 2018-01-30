class HealthChannel < ApplicationCable::Channel
  def subscribed
    stream_from "health_#{params[:room]}"
  end

  def unsubscribed; end

  def heartbeat(data)
    ActionCable.server.broadcast "health_#{params[:room]}", action: 'heartbeat', data: 'hello'
  end
end