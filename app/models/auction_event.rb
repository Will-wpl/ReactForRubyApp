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
    event = AuctionEvent.new
    event.auction_when = Time.now
    event.auction_do = action
    event.auction_what = what
    event.auction_id = auction_id
    event.user_id = user_id
    event.save
  end
end
