class ChatInfoDto
  attr_accessor :chat, :propose_deviation, :retailer_response, :sp_response, :response_status, :sp_response_status

  def initialize(chat)
    @chat = chat
  end
end