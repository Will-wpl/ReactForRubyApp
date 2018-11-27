class AuctionContract < ApplicationRecord

  # Extends

  # Includes

  # Associations
  belongs_to :auction
  # accepts_nested_attributes

  # Validations

  # Scopes
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.get_contract_period_end_date(begin_date, month)
    begin_date.advance(months: month).advance(days: -1)
  end
end
