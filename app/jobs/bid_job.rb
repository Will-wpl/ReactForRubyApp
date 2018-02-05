class BidJob < ApplicationJob
  queue_as :bid

  def perform(*args)
    hash = JSON.parse(args[0])
    auction_id = hash['auction_id']
    calculate_dto = CalculateDto.new(hash['calculate_dto'])
    ActionCable.server.broadcast "auction_#{auction_id}", data: AuctionHistory.set_bid(calculate_dto), action: 'set_bid'
  end
end