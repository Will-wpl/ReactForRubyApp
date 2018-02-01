class HealthChannel < ApplicationCable::Channel
  def subscribed; end

  def unsubscribed; end

  def heartbeat(data)
    
  end
end