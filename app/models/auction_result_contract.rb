class AuctionResultContract < ApplicationRecord

  STATUS_WIN = 'win'.freeze
  # Extends

  # Includes

  # Associations
  belongs_to :auction
  belongs_to :user, optional: true
  belongs_to :auction_result
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_user, ->(user_id) { where('user_id =?', user_id) }

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
