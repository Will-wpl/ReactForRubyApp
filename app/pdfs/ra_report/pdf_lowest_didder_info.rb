class PdfLowestDidderInfo
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def info
    pdf = param[:pdf]
    auction_result = param[:auction_result]

    unless auction_result.status.nil?
      if auction_result.status == 'win'
        status, status_color = 'Awarded', '228B22'
        bidder_text, bidder_text2, bidder_text3 = 'Summary of Winner', 'Winning Bidder', 'Average Price'
      else
        status, status_color = 'Void', 'dd0000'
        bidder_text, bidder_text2, bidder_text3 = 'Summary of Lowest Bidder', 'Lowest Price Bidder', 'Lowest Average Price:'
      end
      lowest_price_bidder = auction_result.lowest_price_bidder
      lowest_average_price = PdfUtils.number_helper.number_to_currency(auction_result.lowest_average_price.to_f, precision: 4, unit: '$ ', format: '%u%n/kWh')
    else
      status, status_color = 'Void', 'dd0000'
      bidder_text, bidder_text2, bidder_text3 = 'Summary of Lowest Bidder', 'Lowest Price Bidder', 'Lowest Average Price:'
      lowest_price_bidder = auction_result.lowest_price_bidder
      lowest_average_price = PdfUtils.number_helper.number_to_currency(auction_result.lowest_average_price.to_f, precision: 4, unit: '$ ', format: '%u%n/kWh')
    end
    data = [["<font size='18'><color rgb='#{status_color}'>Status: #{status}</color></font>"]]
    data.push(["Justification: #{auction_result.justification}"]) unless auction_result.justification.blank?
    data.push([bidder_text])
    data.push(["#{bidder_text2}: #{lowest_price_bidder}"])
    data.push(["#{bidder_text3}: #{lowest_average_price}"])
    pdf.table(data, :cell_style => {:inline_format => true, :width => pdf.bounds.right, :border_width => 0})
  end
end