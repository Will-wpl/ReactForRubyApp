class AuctionResult < ApplicationRecord
  # Extends

  # Includes

  # Associations

  belongs_to :auction
  belongs_to :user
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_arrangement, ->(user) { joins(auction: :arrangements).where(arrangements: { user_id: user, accept_status: Arrangement::AcceptStatusAccept }) }
  scope :find_by_consumptions, ->(user) { joins(auction: :consumptions).where(consumptions: { user_id: user, participation_status: Consumption::ParticipationStatusParticipate }) }
  scope :find_by_auction_contract_duration, ->(auction_id, contract_duration) { where(auction_id: auction_id, contract_duration: contract_duration)}
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
