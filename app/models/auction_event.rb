class AuctionEvent < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_auction_with_user, ->(auction_id) { left_outer_joins(:user).where('auction_id = ? and user_id is not null', auction_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  def self.set_events(user_id, auction_id, action, what)
    AuctionEvent.create(
      auction_when: Time.now,
      auction_do: action,
      auction_what: what,
      auction_id: auction_id,
      user_id: user_id
    )
  end
end
