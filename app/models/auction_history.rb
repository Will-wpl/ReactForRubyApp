class AuctionHistory < ApplicationRecord
  require 'bigdecimal'
  require 'securerandom'
  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_bidder_histories, ->(auction_id) { where('auction_id = ? and is_bidder = true', auction_id) }
  scope :user_auction_histories, ->(auction_id, user_id) { where('auction_id = ? and user_id = ?', auction_id, user_id) }

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.save_update_sort_init_auction_histories(calculate_dto)
    auction = Auction.find(calculate_dto.auction_id)
    user_auction_histories = user_auction_histories(calculate_dto.auction_id, calculate_dto.user_id)

    total_award_sum = set_total_award_sum(
      [auction.total_lt_peak, auction.total_lt_off_peak,
       auction.total_hts_peak, auction.total_hts_off_peak,
       auction.total_htl_peak, auction.total_htl_off_peak],
      [calculate_dto.lt_peak, calculate_dto.lt_off_peak,
       calculate_dto.hts_peak, calculate_dto.hts_off_peak,
       calculate_dto.htl_peak, calculate_dto.htl_off_peak]
    )
    total_volume = Auction.set_total_volume(
      auction.total_lt_peak, auction.total_lt_off_peak,
      auction.total_hts_peak, auction.total_hts_off_peak,
      auction.total_htl_peak, auction.total_htl_off_peak
    )
    average_price = set_average_price(total_award_sum, total_volume)

    history = user_auction_histories.first_or_create
    history.update(
      lt_peak: calculate_dto.lt_peak,
      lt_off_peak: calculate_dto.lt_off_peak,
      hts_peak: calculate_dto.hts_peak,
      hts_off_peak: calculate_dto.hts_off_peak,
      htl_peak: calculate_dto.htl_peak,
      htl_off_peak: calculate_dto.htl_off_peak,
      bid_time: auction.actual_begin_time,
      actual_bid_time: auction.actual_begin_time,
      average_price: average_price,
      total_award_sum: total_award_sum,
      is_bidder: true
    )

    find_sort_update_auction_histories(calculate_dto.auction_id)
  end

  def self.sort_update_auction_histories(histories)
    histories = histories.order(average_price: :asc, actual_bid_time: :asc)

    count = 0
    tmp_average_price = nil
    histories.each_with_index do |history, index|
      if tmp_average_price == history.average_price
        count += 1
      else
        count = 0
      end
      history.update(ranking: index + 1 - count)
      tmp_average_price = history.average_price
    end
  end

  # Original args: c1, c2, c3, c4, c5, c6, p1, p2, p3, p4, p5, p6
  def self.set_total_award_sum(quantities, prices)
    quantities.zip(prices).inject(BigDecimal.new('0')) do |sum, n|
      sum + (BigDecimal.new(n[0]) * BigDecimal.new(n[1]))
    end
  end

  def self.set_average_price(total_award_sum, total_volume)
    BigDecimal.new(total_award_sum) / BigDecimal.new(total_volume)
  end

  def self.find_sort_update_auction_histories(auction_id)
    histories = find_bidder_histories(auction_id)
    sort_update_auction_histories(histories)
  end

  def self.find_clone_sort_update_auction_histories(auction_id, current_history_id, current_time)
    # histories = AuctionHistory.find_by_sql("select a.* from auction_histories a, (select id , bid_time , min(average_price) from auction_histories where auction_id = :auction_id and is_bidder = :is_bidder group by user_id) b where b.id == a.id order by average_price asc, bid_time asc", {auction_id: auction_id, is_bidder: true})
    histories = AuctionHistory.find_by_sql ['select a.* from auction_histories a inner join users on users.id = a.user_id, (select min(auction_id) as auction_id , user_id, min(average_price) as price from auction_histories where auction_id = ? and is_bidder = true and actual_bid_time <= ? group by user_id) b where b.auction_id = a.auction_id and b.user_id = a.user_id and b.price = a.average_price and a.is_bidder = true order by average_price asc, actual_bid_time asc', auction_id , current_time]
    ids = []
    flag = SecureRandom.uuid
    count = 0
    tmp_average_price = nil
    histories.each_with_index do |history, index|
      if tmp_average_price == history.average_price
        count += 1
      else
        count = 0
      end
      # puts history, index
      if history.id == current_history_id
        ids.push(history.id) if history.update(ranking: index + 1 - count, flag: flag)
        # update
      else
        # save
        history_new = AuctionHistory.new
        history_new.auction_id = history.auction_id
        history_new.user_id = history.user_id
        history_new.ranking = index + 1 - count
        history_new.average_price = history.average_price
        history_new.lt_peak = history.lt_peak
        history_new.lt_off_peak = history.lt_off_peak
        history_new.hts_peak = history.hts_peak
        history_new.hts_off_peak = history.hts_off_peak
        history_new.htl_peak = history.htl_peak
        history_new.htl_off_peak = history.htl_off_peak
        history_new.bid_time = current_time
        history_new.actual_bid_time = history.actual_bid_time
        history_new.total_award_sum = history.total_award_sum
        history_new.is_bidder = false
        history_new.flag = flag
        ids.push(history_new.id) if history_new.save
      end
      tmp_average_price = history.average_price
    end
    # histories = AuctionHistory.find(ids)
    histories = AuctionHistory.select('auction_histories.* , users.company_name').joins(:user).find(ids)
    histories
  end
end
