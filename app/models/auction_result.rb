class AuctionResult < ApplicationRecord
  # Extends

  # Includes

  # Associations

  belongs_to :auction
  belongs_to :user, optional: true
  has_many :auction_result_contracts, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_arrangement_contract, ->(user) { joins(:auction_result_contracts, auction: :arrangements).where(auction_result_contracts: {user: user}, arrangements: { user: user, accept_status: Arrangement::AcceptStatusAccept }) }
  scope :find_by_arrangement, ->(user) { joins(auction: :arrangements).where(arrangements: { user_id: user, accept_status: Arrangement::AcceptStatusAccept }) }
  scope :find_by_consumptions, ->(user) { joins(auction: :consumptions).where(consumptions: { user_id: user, participation_status: Consumption::ParticipationStatusParticipate, accept_status: Consumption::AcceptStatusApproved }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
