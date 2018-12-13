class RequestAttachment < ApplicationRecord

  # Extends
  FileType_TC = 'TC'.freeze
  # Includes

  # Associations
  # belongs_to :request_auction

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_type_request, ->(file_type, request_id) { where('file_type = ? and request_auction_id = ?', file_type, request_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.has_attachment(file_type, auction_id)
    request_id = Auction.find(auction_id).request_auction_id
    request = RequestAuction.find_by id: request_id
    if request.nil?
      false
    else
      request_attachment = RequestAttachment.find_by_type_request(file_type, request.id).order(updated_at: :desc).first
      if request_attachment.nil?
        false
      else
        true
      end
    end
  end

  def self.find_last_by_type_request(file_type, request_id)
    request = RequestAuction.find_by id: request_id
    unless request.nil?
      RequestAttachment.find_by_type_request(file_type, request.id).order(updated_at: :desc).first
    end
  end
end
