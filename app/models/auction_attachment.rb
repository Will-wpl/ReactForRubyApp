class AuctionAttachment < ApplicationRecord

  # Extends

  # Includes

  # Associations
  belongs_to :auction
  belongs_to :user

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :belong_auction, ->(auction_id) { where('auction_id = ? and user_id is null', auction_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
