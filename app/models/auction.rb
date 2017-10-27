class Auction < ApplicationRecord
  # Extends

  # Includes

  # Associations
  has_many :arrangements
  has_many :users , :through => :arrangements
  has_many :auction_histories
  has_many :auction_events
  has_one :auction_results
  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
