module RedisHelper
  def self.get_auction(auction_id)
    auction_key = "auction_#{auction_id}"
    auction = $redis.get(auction_key)
    if auction.nil?
      auction = Auction.find(auction_id)
      $redis.set(auction_key, auction.to_json)
      @auction = auction
    else
      hash_auction = JSON.parse(auction)
      @auction = Auction.new(hash_auction)
    end
  end

  def self.set_auction(auction)
    $redis.set("auction_#{auction.id}", auction.to_json)
  end
end
