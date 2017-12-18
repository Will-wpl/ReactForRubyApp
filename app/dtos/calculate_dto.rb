class CalculateDto
  attr_accessor :hts_peak, :htl_off_peak, :user_id, :lt_off_peak, :lt_peak, :hts_off_peak, :auction_id, :htl_peak, :total_htl_peak, :total_lt_peak, :total_htl_off_peak, :total_hts_off_peak, :total_lt_off_peak, :total_hts_peak

  def initialize(options={})
    @hts_peak = options['hts_peak']
    @htl_off_peak = options['htl_off_peak']
    @user_id = options['user_id']
    @lt_off_peak = options['lt_off_peak']
    @lt_peak = options['lt_peak']
    @hts_off_peak = options['hts_off_peak']
    @auction_id = options['auction_id']
    @htl_peak = options['htl_peak']
    @total_htl_peak = options['total_htl_peak']
    @total_lt_peak = options['total_lt_peak']
    @total_htl_off_peak = options['total_htl_off_peak']
    @total_hts_off_peak = options['total_hts_off_peak']
    @total_lt_off_peak = options['total_lt_off_peak']
    @total_hts_peak = options['total_hts_peak']
  end
end
