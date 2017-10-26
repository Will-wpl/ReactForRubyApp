class Auction < ApplicationRecord
  # Extends

  # Includes

  # Associations
  has_many :arrangements
  has_many :users , :through => :arrangements
  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
