class CalculateDto
  attr_accessor :hts_peak, :htl_off_peak, :user_id, :lt_off_peak, :lt_peak, :hts_off_peak, :auction_id, :htl_peak, :total_htl_peak, :total_lt_peak, :total_htl_off_peak, :total_hts_off_peak, :total_lt_off_peak, :total_hts_peak

  def initialize(c1,c2,c3,c4,c5,c6,p1, p2, p3, p4, p5, p6, auction_id, user_id)
    @auction_id = auction_id
    @user_id = user_id
    @lt_peak = p1
    @lt_off_peak = p2
    @hts_peak = p3
    @hts_off_peak = p4
    @htl_peak = p5
    @htl_off_peak = p6
    @total_lt_peak = c1
    @total_lt_off_peak = c2
    @total_hts_peak = c3
    @total_hts_off_peak = c4
    @total_htl_peak = c5
    @total_htl_off_peak = c6
  end

  def initialize(p1, p2, p3, p4, p5, p6, auction_id, user_id)
    @auction_id = auction_id
    @user_id = user_id
    @lt_peak = p1
    @lt_off_peak = p2
    @hts_peak = p3
    @hts_off_peak = p4
    @htl_peak = p5
    @htl_off_peak = p6
  end
end

