class Consumption < ApplicationRecord

  # Field description:
  # participation_status
  # "0":"Reject", "1":"Participate", "2":"Pending"
  # action_status: admin select buyers in auction creation
  # "1":"Notification sent", "2":"Pending Notification"

  ParticipationStatusReject = '0'.freeze
  ParticipationStatusParticipate = '1'.freeze
  ParticipationStatusPending = '2'.freeze

  ActionStatusSent = '1'.freeze
  ActionStatusPending = '2'.freeze

  Acknowledged = '1'.freeze

  AcceptStatusReject = '0'.freeze
  AcceptStatusApproved = '1'.freeze
  AcceptStatusPending = '2'.freeze

  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_many :consumption_details, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :mine, ->(user_id) { where( user_id: user_id) }
  scope :find_notify_buyer, -> { where(action_status: ActionStatusSent) } # "action_status = '1'"
  scope :find_by_auction_id, ->(auction_id) { where('auction_id = ?', auction_id) }
  scope :join_buyer_auction, -> { includes(:auction).where.not(auctions: { publish_status: nil }) }
  scope :find_buyer_result_auction, -> { includes(auction: :auction_result).where(auction_results: { status: nil }).where.not(auctions: { publish_status: nil })}
  scope :find_by_user_consumer_type, ->(consumer_type) { includes(:user).where(users: { consumer_type: consumer_type, approval_status: ['1','2'] }) }
  scope :find_by_user_consumer_type_contract_duration, ->(consumer_type, contract_duration) { includes(:user).where(contract_duration: contract_duration, participation_status: ParticipationStatusParticipate, accept_status: AcceptStatusApproved, users: { consumer_type: consumer_type, approval_status: ['1','2'] }) }
  scope :is_participation, -> { where(participation_status: ParticipationStatusParticipate) }
  scope :is_accpet, -> { where( accept_status: Consumption::AcceptStatusApproved)}
  scope :find_by_user, ->(user_id) { where('user_id =?', user_id) }

  scope :find_by_auction_and_user, ->(auction_id, user_id) { where('auction_id = ? and user_id =?', auction_id, user_id) }
  scope :is_not_notify, -> { where(action_status: ActionStatusPending) } # "action_status = '2'"
  scope :admin_find_by_id, ->(id) { where(id: id).take }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  #
  def self.get_company_user_count(auction_id)
    get_company_user_by_auction(auction_id).count
  end

  def self.get_company_user_duration_count(auction_id, contract_duration)
    get_company_user_by_auction_duration(auction_id, contract_duration).count
  end

  def self.get_company_user(auction_id)
    get_company_user_by_auction(auction_id)
  end

  def self.get_company_user_duration(auction_id, contract_duration)
    get_company_user_by_auction_duration(auction_id, contract_duration)
  end

  def self.update_value(auction_id, _consumption, _intake_values)
    Auction.find(auction_id)
  end

  def self.convert_intake_value(intake_level, peak, off_peak)
    intake_value = []
    if intake_level.underscore == 'lt'
      intake_value = [peak, off_peak, 0, 0, 0, 0, 0, 0]
    elsif intake_level.underscore == 'hts'
      intake_value = [0, 0, peak, off_peak, 0, 0, 0, 0]
    elsif intake_level.underscore == 'htl'
      intake_value = [0, 0, 0, 0, peak, off_peak, 0, 0]
    elsif intake_level.underscore == 'eht'
      intake_value = [0, 0, 0, 0, 0, 0, peak, off_peak]
    end
    intake_value
  end

  def self.set_intake_value(intake_value_array)
    intake_values = [0, 0, 0, 0, 0, 0, 0, 0]
    intake_value_array.each do |intake_value|
      intake_values[0] += BigDecimal.new(intake_value[0])
      intake_values[1] += BigDecimal.new(intake_value[1])
      intake_values[2] += BigDecimal.new(intake_value[2])
      intake_values[3] += BigDecimal.new(intake_value[3])
      intake_values[4] += BigDecimal.new(intake_value[4])
      intake_values[5] += BigDecimal.new(intake_value[5])
      intake_values[6] += BigDecimal.new(intake_value[6])
      intake_values[7] += BigDecimal.new(intake_value[7])
    end
    intake_values
  end

  def self.change_nil_value(value)
    value.nil? ? 0: value
  end

  def self.get_lt_peak(lt_peak)
    lt_peak.nil? ? 0 : lt_peak
  end

  def self.get_lt_off_peak(lt_off_peak)
    lt_off_peak.nil? ? 0 : lt_off_peak
  end

  def self.get_hts_peak(hts_peak)
    hts_peak.nil? ? 0 : hts_peak
  end

  def self.get_hts_off_peak(hts_off_peak)
    hts_off_peak.nil? ? 0 : hts_off_peak
  end

  def self.get_htl_peak(htl_peak)
    htl_peak.nil? ? 0 : htl_peak
  end

  def self.get_htl_off_peak(htl_off_peak)
    htl_off_peak.nil? ? 0 : htl_off_peak
  end

  def self.get_eht_peak(eht_peak)
    eht_peak.nil? ? 0 : eht_peak
  end

  def self.get_eht_off_peak(eht_off_peak)
    eht_off_peak.nil? ? 0 : eht_off_peak
  end

  private

  def self.get_company_user_by_auction(auction_id)
    Consumption.find_by_auction_id(auction_id).find_by_user_consumer_type(User::ConsumerTypeCompany).is_participation
  end

  def self.get_company_user_by_auction_duration(auction_id, contract_duration)
    get_company_user_by_auction(auction_id).where(contract_duration: contract_duration)
  end
end
