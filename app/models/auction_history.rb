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

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  # set bid, root function
  def self.set_bid(calculate_dto)
    total_award_sum = AuctionHistory.set_total_award_sum(calculate_dto.total_lt_peak, calculate_dto.total_lt_off_peak,
                                                         calculate_dto.total_hts_peak, calculate_dto.total_hts_off_peak,
                                                         calculate_dto.total_htl_peak, calculate_dto.total_htl_off_peak,
                                                         calculate_dto.total_eht_peak, calculate_dto.total_eht_off_peak,
                                                         calculate_dto.lt_peak, calculate_dto.lt_off_peak,
                                                         calculate_dto.hts_peak, calculate_dto.hts_off_peak,
                                                         calculate_dto.htl_peak, calculate_dto.htl_off_peak,
                                                         calculate_dto.eht_peak, calculate_dto.eht_off_peak)
    total_volume = Auction.set_total_volume(
      calculate_dto.total_lt_peak, calculate_dto.total_lt_off_peak,
      calculate_dto.total_hts_peak, calculate_dto.total_hts_off_peak,
      calculate_dto.total_htl_peak, calculate_dto.total_htl_off_peak,
      calculate_dto.total_eht_peak, calculate_dto.total_eht_off_peak
    )
    average_price = AuctionHistory.set_average_price(total_award_sum, total_volume)

    unless has_less_than_or_equal_to_average_price(calculate_dto.auction_id, calculate_dto.user_id, average_price)
      current_time = Time.current
      history = AuctionHistory.new(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, eht_peak: calculate_dto.eht_peak, eht_off_peak: calculate_dto.eht_off_peak, bid_time: current_time, actual_bid_time: current_time,
                                    user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
      # AuctionEvent.set_events(@history.user_id, @history.auction_id, 'set bid', @history.to_json)
      # if @history.save
      #   # update sort
      #
      #   ids = create_bid_slice_up(calculate_dto.auction_id, @history, current_time)
      #   find_histories_by_ids(ids)
      # end
      ids = create_bid_slice_up_cache(calculate_dto.auction_id, history, current_time)
      find_histories_by_ids(ids)
    end
  end

  # create history slice up by redis when retailer set bid, belong to set_bid function
  def self.create_bid_slice_up_cache(auction_id, current_history, current_time)
    histories = RedisHelper.get_current_sorted_histories(auction_id)
    new_histories = histories.reject do |history|
      history.user_id == current_history.user_id
    end
    new_histories.push(current_history)
    sort_ids(new_histories, current_history, current_time)
  end

  # sort by average_price and actual_bid_time when retailer set bid, belong to set_bid function
  def self.bid_and_sort(histories)
    histories.sort_by! { |history| [history['average_price'], history['actual_bid_time']] }
  end

  # sort, set redis cache and save to db, return ids, belong to set_bid function
  # @return [ids] the ids of slice up histories
  def self.sort_ids(histories, current_history, current_time)
    sorted_histories = bid_and_sort(histories)
    ids = []
    flag = SecureRandom.uuid
    count = 0
    tmp_average_price = nil
    new_histories = []
    sorted_histories.each_with_index do |history, index|
      if tmp_average_price == history.average_price
        count += 1
      else
        count = 0
      end
      # puts history, index
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
      history_new.eht_peak = history.eht_peak
      history_new.eht_off_peak = history.eht_off_peak
      history_new.bid_time = current_time
      history_new.actual_bid_time = history.actual_bid_time
      history_new.total_award_sum = history.total_award_sum
      history_new.is_bidder = history.user_id == current_history.user_id
      history_new.flag = flag
      new_histories.push(history_new)
      tmp_average_price = history.average_price
    end
    RedisHelper.set_current_sorted_histories(current_history.auction_id, new_histories)
    new_histories.each do |history|
      ids.push(history.id) if history.save
      AuctionEvent.set_events(history.user_id, history.auction_id, 'set bid', history.to_json) if history.user_id == current_history.user_id
    end
    ids
  end

  # The histories has less than or equal to current average price
  def self.has_less_than_or_equal_to_average_price(auction_id, user_id, average_price)
    AuctionHistory.where('auction_id = ? and user_id = ? and is_bidder = true and average_price <= ?', auction_id, user_id, average_price).exists?
  end

  # when any retailer submit arrangement, then update and sort the init auction history. root function 2
  def self.save_update_sort_init_auction_histories(calculate_dto)
    @auction = Auction.find(calculate_dto.auction_id)
    @histories = AuctionHistory.where('auction_id = ? and user_id = ?', calculate_dto.auction_id, calculate_dto.user_id)
    total_volume = Auction.set_total_volume(
      @auction.total_lt_peak, @auction.total_lt_off_peak,
      @auction.total_hts_peak, @auction.total_hts_off_peak,
      @auction.total_htl_peak, @auction.total_htl_off_peak,
      @auction.total_eht_peak, @auction.total_eht_off_peak
    )
    total_award_sum = set_total_award_sum(@auction.total_lt_peak, @auction.total_lt_off_peak,
                                          @auction.total_hts_peak, @auction.total_hts_off_peak,
                                          @auction.total_htl_peak, @auction.total_htl_off_peak,
                                          @auction.total_eht_peak, @auction.total_eht_off_peak,
                                          calculate_dto.lt_peak, calculate_dto.lt_off_peak,
                                          calculate_dto.hts_peak, calculate_dto.hts_off_peak,
                                          calculate_dto.htl_peak, calculate_dto.htl_off_peak,
                                          calculate_dto.eht_peak, calculate_dto.eht_off_peak)
    average_price = set_average_price(total_award_sum, total_volume)
    if @histories.count == 0
      @history = AuctionHistory.new(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, eht_peak: calculate_dto.eht_peak, eht_off_peak: calculate_dto.eht_off_peak, bid_time: @auction.actual_begin_time, actual_bid_time: @auction.actual_begin_time,
                                    user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
      if @history.save
        find_sort_update_auction_histories(calculate_dto.auction_id)
      end
    else
      @history = @histories.first
      if @history.update(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, eht_peak: calculate_dto.eht_peak, eht_off_peak: calculate_dto.eht_off_peak, bid_time: @auction.actual_begin_time, actual_bid_time: @auction.actual_begin_time,
                         user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
        find_sort_update_auction_histories(calculate_dto.auction_id)
      end
    end
  end

  # find the all bidder histories in one auction
  def self.find_bidder_histories(auction_id)
    AuctionHistory.where('auction_id = ? and is_bidder = ?', auction_id, true)
  end

  def self.set_total_award_sum(c1, c2, c3, c4, c5, c6, c7, c8, p1, p2, p3, p4, p5, p6, p7, p8)
    BigDecimal.new(c1) * BigDecimal.new(p1) + BigDecimal.new(c2) * BigDecimal.new(p2) + BigDecimal.new(c3) * BigDecimal.new(p3) + BigDecimal.new(c4) * BigDecimal.new(p4) + BigDecimal.new(c5) * BigDecimal.new(p5) + BigDecimal.new(c6) * BigDecimal.new(p6) + BigDecimal.new(c7) * BigDecimal.new(p7) + BigDecimal.new(c8) * BigDecimal.new(p8)
  end

  def self.set_average_price(total_award_sum, total_volume)
    BigDecimal.new(total_award_sum) / BigDecimal.new(total_volume)
  end

  # for init history data, belong to root function 2
  def self.find_sort_update_auction_histories(auction_id)
    histories = find_bidder_histories(auction_id)
    sort_update_auction_histories(auction_id, histories)
  end

  # sort and update the input auction histories, belong to root function 2
  def self.sort_update_auction_histories(auction_id, histories)
    # code here
    histories = histories.order(average_price: :asc, actual_bid_time: :asc)
    count = 0
    tmp_average_price = nil
    histories.each_with_index do |history, index|
      if tmp_average_price == history.average_price
        count += 1
      else
        count = 0
      end
      # puts history, index
      history.update(ranking: index + 1 - count)
      tmp_average_price = history.average_price
    end
    RedisHelper.set_current_sorted_histories(auction_id, histories)
    histories
  end

  # create a sorted slice up for each bid, belong to set_bid function
  # @return [ids]
  def self.create_bid_slice_up(auction_id, current_history, current_time)
    # histories = AuctionHistory.find_by_sql("select a.* from auction_histories a, (select id , bid_time , min(average_price) from auction_histories where auction_id = :auction_id and is_bidder = :is_bidder group by user_id) b where b.id == a.id order by average_price asc, bid_time asc", {auction_id: auction_id, is_bidder: true})
    histories = AuctionHistory.find_by_sql ['select a.* from auction_histories a inner join users on users.id = a.user_id, (select min(auction_id) as auction_id , user_id, min(average_price) as price from auction_histories where auction_id = ? and is_bidder = true and actual_bid_time <= ? group by user_id) b where b.auction_id = a.auction_id and b.user_id = a.user_id and b.price = a.average_price and a.is_bidder = true order by average_price asc, actual_bid_time asc', auction_id, current_time]
    # sort_ids(histories, current_history, current_time)
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
      if history.id == current_history.id
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
        history_new.eht_peak = history.eht_peak
        history_new.eht_off_peak = history.eht_off_peak
        history_new.bid_time = current_time
        history_new.actual_bid_time = history.actual_bid_time
        history_new.total_award_sum = history.total_award_sum
        history_new.is_bidder = false
        history_new.flag = flag
        ids.push(history_new.id) if history_new.save
      end
      tmp_average_price = history.average_price
    end
    ids
  end

  # find auction histories by auction ids(array), belong to set_bid function
  def self.find_histories_by_ids(ids)
    AuctionHistory.select('auction_histories.* , users.company_name').joins(:user).find(ids)
  end
end
