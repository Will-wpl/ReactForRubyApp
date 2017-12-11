class BidJob < ApplicationJob
  queue_as :bid

  def perform(*args)
    auction_id = args[0]
    calculate_dto = args[1]
    ActionCable.server.broadcast "auction_#{auction_id}", data: AuctionHistory.set_bid(calculate_dto), action: 'set_bid'
  end
end