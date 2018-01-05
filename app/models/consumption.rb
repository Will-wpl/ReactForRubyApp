class Consumption < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_many :consumption_details
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :mine, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_by_auction_id, ->(auction_id) { where('auction_id = ?', auction_id) }
  scope :join_buyer_auction, -> { includes(:auction).where.not(auctions: { publish_status: nil }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
