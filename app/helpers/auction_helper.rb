module AuctionHelper
  def self.get_auction(auction_id)
    auction = $redis.get("auction_#{auction_id}")
    if auction.nil?
      auction = Auction.find(auction_id)
      $redis.set("auction_#{auction_id}", auction.to_json)
    end
    hash_auction = JSON.parse(auction)
    @auction = Auction.new(hash_auction)
  end

  def self.set_auction(auction)
    $redis.set("auction_#{auction.id}", auction.to_json)
  end
end
