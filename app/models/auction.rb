class Auction < ApplicationRecord

  # Important
  # Discarded fields: lt_peak lt_off_peak hts_peak hts_off_peak htl_peak htl_off_peak eht_peak eht_off_peak


PublishStatusPublished = '1'.freeze
SingleBuyerType = '0'.freeze
MultipleBuyerType = '1'.freeze
AllowDeviation = '1'.freeze
NotAllowDeviation = '0'.freeze
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
  has_one :auction_result, dependent: :destroy
  has_one :request_auction
  # accepts_nested_attributes

  # Validations

  # Scopes

  scope :published, -> { where("publish_status = '1'") }
  scope :current_year, -> { where("to_char(actual_begin_time,'yyyy') = ?", Time.current.year.to_s) }
  scope :has_auction_result, -> { includes(:auction_result).where(auction_results: { status: nil }) }
  scope :unpublished, -> { where("publish_status = '0'") }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.has_request(auction_id)
    if Auction.find(auction_id).request_auction_id.nil?
      false
    else
      true
    end
  end

  def self.get_tc_attach_info_id(tc_attach_info_json, type)
    tc_attach_info = JSON.parse(tc_attach_info_json)
    tc_attach_info[type]
  end

  def self.set_total_volume(*values)
    values.inject(BigDecimal.new('0')) { |sum, n| sum + BigDecimal.new(n.nil? ? 0 : n) }
  end

  def self.get_days(start_date, end_date)
    timestamp = (end_date - start_date).to_i + 1
    timestamp
  end

  def self.set_c_value(c, days)
    BigDecimal.new(c.nil? ? 0 : c) * 12 / 365 * days
  end

  def self.set_zero(value)
    value.nil? ? 0 : value
  end

  def self.check_start_price_incomplete(auction)
    if auction.auction_contracts.nil?
      incomplete = false
    else
      incomplete = false
      auction.auction_contracts.each do |contract|
        if contract.starting_price_lt_peak.nil? || contract.starting_price_lt_off_peak.nil? || contract.starting_price_hts_peak.nil? || contract.starting_price_hts_off_peak.nil? ||
            contract.starting_price_htl_peak.nil? || contract.starting_price_htl_off_peak.nil? || contract.starting_price_eht_peak.nil? || contract.starting_price_eht_off_peak.nil?
          incomplete = true
          break
        end
      end
    end
    incomplete

  end
end
