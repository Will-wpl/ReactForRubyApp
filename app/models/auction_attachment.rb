class AuctionAttachment < ApplicationRecord

  # tender_documents_upload
  # buyer_tc_upload
  # retailer_confidentiality_undertaking_upload
  # birefing_pack_upload


  # Extends

  # Includes

  # Associations
  belongs_to :auction

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :belong_auction, ->(auction_id) { where('auction_id = ? and user_id is null', auction_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
