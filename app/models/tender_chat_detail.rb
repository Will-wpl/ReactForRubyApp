class TenderChatDetail < ApplicationRecord

  # comments
  # response_status
  # '2' retailer save
  # '3' retailer submit deviation
  # '4' retailer withdraw

  # Extends

  # Includes

  # Associations

  belongs_to :tender_chat

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :retailer_response, ->(chat_id) { where("tender_chat_id = ? and (sp_response = '' or sp_response is null)", chat_id) }
  scope :admin_response, ->(chat_id) { where("tender_chat_id = ? and (retailer_response = '' or retailer_response is null)", chat_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.chat_save(chat, chat_info)
    ActiveRecord::Base.transaction do
      chat_detail = TenderChatDetail.new
      chat_detail.tender_chat = chat_info.chat
      chat_detail.propose_deviation = chat_info.propose_deviation
      chat_detail.retailer_response = chat_info.retailer_response
      chat_detail.response_status = chat_info.response_status
      chat_detail.sp_response = chat_info.sp_response
      if chat_detail.save
        chat.sp_response_status = chat_info.sp_response_status
        chat.save
      end
    end
    chat
  end

end
