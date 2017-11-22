class AuctionEvent < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  # accepts_nested_attributes

  # Validations

  # Scopes

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
