class Consumption < ApplicationRecord

  # Field description:
  # participation_status
  # "0":"Reject", "1":"Participate", "2":"Pending"
  # action_status: admin select buyers in auction creation
  # "1":"Notification sent", "2":"Pending Notification"

  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_many :consumption_details
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :mine, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_by_auction_id, ->(auction_id) { where('auction_id = ?', auction_id) }
  scope :join_buyer_auction, -> { includes(:auction).where.not(auctions: { publish_status: nil }) }
  scope :find_by_user_consumer_type, ->(consumer_type) { includes(:user).where(users: { consumer_type: consumer_type }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  def self.update_value(auction_id, _consumption, _intake_values)
    auction = Auction.find(auction_id)
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
