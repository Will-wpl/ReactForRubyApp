class PdfReversePriceTable
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def table
    pdf, auction_contract = param[:pdf], param[:auction_contract]
    histories_achieved = param[:histories_achieved]
    average_price = 0
    average_price = histories_achieved[0].average_price unless histories_achieved.empty?

    pdf.table [["Reverse Price"]], :cell_style => {:size => 18, :inline_format => true, :width => pdf.bounds.right, :border_width => 0}
    head_row, peak_row, off_peak_row = [''], ['Peak'], ['Off Peak']
    push_colume_data({:pdf => param[:pdf], :average_price => average_price, :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'LT', :peak => auction_contract.reserve_price_lt_peak, :off_peak => auction_contract.reserve_price_lt_off_peak})
    push_colume_data({:pdf => param[:pdf], :average_price => average_price, :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'HT(Small)', :peak => auction_contract.reserve_price_hts_peak, :off_peak => auction_contract.reserve_price_hts_off_peak})

    push_colume_data({:pdf => param[:pdf], :average_price => average_price, :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'HT(Large)', :peak => auction_contract.reserve_price_htl_peak, :off_peak => auction_contract.reserve_price_htl_off_peak})
    push_colume_data({:pdf => param[:pdf], :average_price => average_price, :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'EHT', :peak => auction_contract.reserve_price_eht_peak, :off_peak => auction_contract.reserve_price_eht_off_peak})

#
    pdf.table([head_row, peak_row, off_peak_row], :header => true, :cell_style => {:width => pdf.bounds.right / head_row.size, :size => 9, :align => :center, :valign => :center, :padding => [8, 6, 14], :inline_format => true, :border_width => 0.01, :border_color => "424242"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def number_format(num)
    PdfUtils.number_helper.number_to_currency(num, precision: 4, unit: '')
  end

  def push_colume_data(param)

    average_price = param[:average_price]
    pdf = param[:pdf]

    title, peak, off_peak = param[:title], param[:peak], param[:off_peak]
    head_row, peak_row, off_peak_row = param[:head_row], param[:peak_row], param[:off_peak_row]
    is_zero = false
    is_zero = true if (peak == 0 || peak.blank?) && (off_peak == 0 || off_peak.blank?)
    unless is_zero
      head_row.push(title)
      img_table = pdf.make_table([[{:image => get_achieved_img(average_price,  peak)}, number_format(peak)]], :header => true, :cell_style => { :size => 9, :align => :center, :valign => :center, :padding => [0, 2, 0], :inline_format => true, :border_width => 0.0})
      peak_row.push(img_table)

      img_table = pdf.make_table([[{:image => get_achieved_img(average_price,  off_peak)}, number_format(off_peak)]], :header => true, :cell_style => { :size => 9, :align => :center, :valign => :center, :padding => [0, 2, 0], :inline_format => true, :border_width => 0.0})
      off_peak_row.push(img_table)
    end
  end

  def get_achieved_img(average_price, reserve_price)
    # achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?
    achieved = average_price <= reserve_price
    if achieved
      Rails.root.join("app", "assets", "pdf", "achieved.png")
    else
      Rails.root.join("app", "assets", "pdf", "not_achieved.png")
    end
  end
end