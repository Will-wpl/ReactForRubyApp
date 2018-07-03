class Auction < ApplicationRecord

  # Important
  # Discarded fields: lt_peak lt_off_peak hts_peak hts_off_peak htl_peak htl_off_peak eht_peak eht_off_peak


PublishStatusPublished = '1'.freeze
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
  has_many :auction_contracts, dependent: :destroy
  has_many :auction_results, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes

  scope :published, -> { where("publish_status = '1'") }
  scope :current_year, -> { where("to_char(actual_begin_time,'yyyy') = ?", Time.current.year.to_s) }
  scope :has_auction_result, -> { includes(:auction_results).where(auction_results: { status: nil }) }
  scope :unpublished, -> { where("publish_status = '0'") }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.set_total_volume(*values)
    values.inject(BigDecimal.new('0')) { |sum, n| sum + BigDecimal.new(n) }
  end

  def self.get_days(start_date, end_date)
    timestamp = (end_date - start_date).to_i + 1
    timestamp
  end

  def self.set_c_value(c, days)
    BigDecimal.new(c) * 12 / 365 * days
  end
end
