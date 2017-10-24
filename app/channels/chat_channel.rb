class ChatChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "chat_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def buy(data)
    p "------------get params chanel is:#{params[:channel]}, room: #{params[:room]}"
    ActionCable.server.broadcast "chat_#{params[:room]}", data
  end
end
