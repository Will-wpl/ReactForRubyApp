class AuctionResult < ApplicationRecord
  # Extends

  # Includes

  # Associations

  belongs_to :auction

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_arrangement, ->(user) { joins(auction: :arrangements).where(arrangements: { user_id: user }) }

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
