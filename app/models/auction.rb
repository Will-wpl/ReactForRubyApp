class Auction < ApplicationRecord
  require 'bigdecimal'
  # Extends

  # Includes

  # Associations
  has_many :arrangements
  has_many :users , :through => :arrangements
  has_many :auction_histories
  has_many :auction_events
  has_one :auction_result
  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.set_total_volume(c1, c2, c3, c4, c5, c6)
    BigDecimal.new(c1) +  BigDecimal.new(c2) +  BigDecimal.new(c3) +  BigDecimal.new(c4) +  BigDecimal.new(c5) +  BigDecimal.new(c6)
  end
end
