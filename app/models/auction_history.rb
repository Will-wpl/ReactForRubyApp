class AuctionHistory < ApplicationRecord
  require 'bigdecimal'
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

  def self.save_update_init_auction_histories(calculate_dto)
    @auction = Auction.find(calculate_dto.auction_id)
    @histories = AuctionHistory.where('auction_id = ? and user_id = ?', calculate_dto.auction_id , calculate_dto.user_id)
    total_volume = Auction.set_total_volume(
        @auction.total_lt_peak,@auction.total_lt_off_peak,
        @auction.total_hts_peak,@auction.total_hts_off_peak,
        @auction.total_htl_peak, @auction.total_htl_off_peak)
    total_award_sum = set_total_award_sum(@auction.total_lt_peak,@auction.total_lt_off_peak,
                                          @auction.total_hts_peak,@auction.total_hts_off_peak,
                                          @auction.total_htl_peak, @auction.total_htl_off_peak,
                                          calculate_dto.lt_peak,calculate_dto.lt_off_peak,calculate_dto.hts_peak,calculate_dto.hts_off_peak, calculate_dto.htl_peak,calculate_dto.htl_off_peak)
    average_price = set_average_price(total_award_sum, total_volume)
    if @histories.count == 0
      @history = AuctionHistory.new(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, bid_time: Time.now,
                                  user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
      if @history.save
        histories = AuctionHistory.where(auction_id: calculate_dto.auction_id)
        sort_update_auction_histories(histories)
      end
    else
      @history = @histories.first
      if @history.update(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, bid_time: Time.now,
                      user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
        histories = AuctionHistory.where(auction_id: calculate_dto.auction_id)
        sort_update_auction_histories(histories)
      end
    end
  end

  def self.sort_update_auction_histories(histories)
    # code here
    @histories = histories.order(total_award_sum: :asc)
    @histories.each_with_index { |history, index|
      # puts history, index
      history.update(ranking: index + 1)
    }
  end

  def self.set_total_award_sum(c1,c2,c3,c4,c5,c6,p1,p2,p3,p4,p5,p6)
    BigDecimal.new(c1) * BigDecimal.new(p1) + BigDecimal.new(c2) * BigDecimal.new(p2) + BigDecimal.new(c3) * BigDecimal.new(p3) + BigDecimal.new(c4) * BigDecimal.new(p4) + BigDecimal.new(c5) * BigDecimal.new(p5) + BigDecimal.new(c6) * BigDecimal.new(p6)
  end

  def self.set_average_price(total_award_sum, total_volume)
    BigDecimal.new(total_award_sum) / BigDecimal.new(total_volume)
  end

end
