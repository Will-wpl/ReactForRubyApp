class PdfReversePriceTable
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def table
    pdf, auction_contract = param[:pdf], param[:auction_contract]
    auction_result = param[:auction_result]
    pdf.fill_color "000000"
    pdf.table [["Reverse Price"]], :cell_style => {:size => 16, :inline_format => true, :width => pdf.bounds.right, :border_width => 0}
    head_row, peak_row, off_peak_row = [''], ['Peak<br/>(7am-7pm)'], ['Off Peak<br/>(7pm-7am)']
    push_colume_data({:pdf => param[:pdf], :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => '<b>LT</b>', :peak => auction_contract.reserve_price_lt_peak, :off_peak => auction_contract.reserve_price_lt_off_peak, :result_peak => auction_result.lt_peak, :result_off_peak => auction_result.lt_off_peak}) if param[:visibilities][:visibility_lt]
    push_colume_data({:pdf => param[:pdf], :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => '<b>HTS</b>', :peak => auction_contract.reserve_price_hts_peak, :off_peak => auction_contract.reserve_price_hts_off_peak, :result_peak => auction_result.hts_peak, :result_off_peak => auction_result.hts_off_peak}) if param[:visibilities][:visibility_hts]

    push_colume_data({:pdf => param[:pdf], :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => '<b>HTL</b>', :peak => auction_contract.reserve_price_htl_peak, :off_peak => auction_contract.reserve_price_htl_off_peak, :result_peak => auction_result.htl_peak, :result_off_peak => auction_result.htl_off_peak}) if param[:visibilities][:visibility_htl]
    push_colume_data({:pdf => param[:pdf], :head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => '<b>EHT</b>', :peak => auction_contract.reserve_price_eht_peak, :off_peak => auction_contract.reserve_price_eht_off_peak, :result_peak => auction_result.eht_peak, :result_off_peak => auction_result.eht_off_peak}) if param[:visibilities][:visibility_eht]

#
    pdf.table([head_row, peak_row, off_peak_row], :header => true, :cell_style => {:width => pdf.bounds.right / head_row.size, :size => 9, :align => :center, :valign => :center, :padding => [8, 6, 14], :inline_format => true, :border_width => 0.01, :border_color => "dddddd"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "EEEEEE"
    end
  end

  def number_format(num)
    PdfUtils.number_helper.number_to_currency(num, precision: 4, format: '$ %n/kWh')
  end

  def push_colume_data(param)
    pdf = param[:pdf]
    result_peak, result_off_peak = param[:result_peak], param[:result_off_peak]
    title, peak, off_peak = param[:title], param[:peak], param[:off_peak]
    head_row, peak_row, off_peak_row = param[:head_row], param[:peak_row], param[:off_peak_row]

    head_row.push(title)
    is_yes, img = get_achieved_img(result_peak,  peak)
    if is_yes
      img_table = get_img_table(pdf, img, peak)
      peak_row.push(img_table)
    else
      peak_row.push(number_format(peak))
    end

    is_yes, img = get_achieved_img(result_off_peak,  off_peak)
    if is_yes
      img_table = get_img_table(pdf, img, off_peak)
      off_peak_row.push(img_table)
    else
      off_peak_row.push(number_format(off_peak))

    end

  end

  def get_img_table(pdf, img, number)
    pdf.make_table([[{:image => img, :vposition => :center, :image_height => 12, :image_width => 12}, number_format(number)]],:position => :center, :cell_style => { :size => 9, :align => :center, :valign => :center, :padding => [0, 2, 0], :inline_format => true, :border_width => 0.0})
  end

  def get_achieved_img(result_price, reserve_price)
    # achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?
    achieved = result_price <= reserve_price
    if achieved
      return true, Rails.root.join("app", "assets", "pdf", "yes.png")
    else
      return false, nil
    end
  end
end