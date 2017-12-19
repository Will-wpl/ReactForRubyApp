class Auction < ApplicationRecord
  # Extends

  # Includes

  # Associations
  has_many :arrangements
  has_many :users, through: :arrangements
  has_many :auction_histories
  has_many :auction_events
  has_one :auction_result
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :published, -> { where(publish_status == '1') }
  scope :unpublished, -> { where(publish_status == '0') }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.set_total_volume(*values)
    values.inject(BigDecimal.new('0')) { |sum, n| sum + BigDecimal.new(n) }
  end
end
