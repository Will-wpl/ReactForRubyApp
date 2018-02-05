module RedisHelper
  def self.get_auction(auction_id)
    auction_key = "auction_#{auction_id}"
    auction_json = $redis.get(auction_key)
    if auction_json.nil?
      auction = Auction.find(auction_id)
      $redis.set(auction_key, auction.to_json)
      auction
    else
      hash_auction = JSON.parse(auction_json)
      Auction.new(hash_auction)
    end
  end

  def self.set_auction(auction)
    $redis.set("auction_#{auction.id}", auction.to_json)
  end

  def self.get_current_sorted_histories(auction_id)
    auction_key = "auction_histories_#{auction_id}"
    histories_json = $redis.get(auction_key)
    list = JSON.parse(histories_json)
    histories = []
    list.each do |history|
      histories.push(AuctionHistory.new(history))
    end
    histories
  end

  def self.set_current_sorted_histories(auction_id, histories)
    $redis.set("auction_histories_#{auction_id}", histories.to_json)
  end
end
