class AuctionExtendTime < ApplicationRecord
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
  def self.set_extend_time(auction, extend_time, user_id)
    auction_extend_time = AuctionExtendTime.new
    auction_extend_time.extend_time = extend_time
    auction_extend_time.current_time = Time.current
    auction_extend_time.actual_begin_time = auction.actual_begin_time
    auction_extend_time.actual_end_time = auction.actual_end_time + 60 * extend_time
    auction_extend_time.auction_id = auction.id
    auction_extend_time.user_id = user_id
    if auction_extend_time.save
      if auction.update(actual_end_time: auction_extend_time.actual_end_time)
        AuctionEvent.set_events(user_id, auction.id, 'extend_time', auction_extend_time.to_json)
      end
    end
  end
end
