class Auction < ApplicationRecord
  # Extends

  # Includes

  # Associations
  has_many :arrangements, dependent: :destroy
  has_many :users, through: :arrangements
  has_many :auction_histories, dependent: :destroy
  has_many :auction_events, dependent: :destroy
  has_many :auction_attachments, dependent: :destroy
  has_many :consumptions, dependent: :destroy
  has_many :users, through: :consumptions
  has_one :auction_result, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes

  scope :published, -> { where("publish_status = '1'") }
  scope :current_year, -> { where("to_char((SELECT now()::timestamp),'yyyy') = ?", Time.current.year.to_s) }
  scope :has_auction_result, -> { includes(:auction_result).where(auction_results: { status: nil }) }
  scope :unpublished, -> { where("publish_status = '0'") }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.set_total_volume(*values)
    values.inject(BigDecimal.new('0')) { |sum, n| sum + BigDecimal.new(n) }
  end
end
