class CalculateDto
  attr_accessor :hts_peak, :htl_off_peak, :user_id, :lt_off_peak, :lt_peak, :hts_off_peak, :auction_id, :htl_peak

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

