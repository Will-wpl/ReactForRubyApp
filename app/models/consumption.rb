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
  scope :select_buyer_list, -> { select('auctions.name, auctions.actual_begin_time, auctions.publish_status, consumptions.participation_status')}
  scope :mine, ->(user_id) { where('user_id = ?', user_id) }
  scope :join_buyer_auction, -> { includes(:auction).where(auctions: { publish_status: '1' }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
