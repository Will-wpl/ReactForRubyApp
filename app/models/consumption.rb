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

  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_many :consumption_details, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :mine, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_notify_buyer, ->{ where(action_status: ActionStatusSent) } # "action_status = '1'"
  scope :find_by_auction_id, ->(auction_id) { where('auction_id = ?', auction_id) }
  scope :join_buyer_auction, -> { includes(:auction).where.not(auctions: { publish_status: nil }) }
  scope :find_by_user_consumer_type, ->(consumer_type) { includes(:user).where(users: { consumer_type: consumer_type }) }
  scope :is_participation, -> { where(participation_status: ParticipationStatusParticipate) }
  scope :find_by_auction_and_user, ->(auction_id, user_id) { where('auction_id = ? and user_id =?', auction_id, user_id) }
  scope :is_not_notify, -> { where(action_status: ActionStatusPending) } # "action_status = '2'"
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  #
  def self.get_company_user_count(auction_id)
    Consumption.find_by_auction_id(auction_id).find_by_user_consumer_type(User::ConsumerTypeCompany).is_participation.count
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
end
