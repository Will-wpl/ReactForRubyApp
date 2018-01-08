class Consumption < ApplicationRecord

  # Field description:
  # participation_status
  # "0":"Reject", "1":"Participate", "2":"Pending"
  # action_status: admin select buyers in auction creation
  # "1":"Notification sent", "2":"Pending Notification"

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
  scope :find_by_user_consumer_type, ->(consumer_type) { includes(:user).where(users: { consumer_type: consumer_type }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
