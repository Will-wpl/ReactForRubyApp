class PdfTotalInfo
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def info
    pdf = param[:pdf]
    auction = param[:auction]
    auction_result = param[:auction_result]
    contract_period_start_date = (auction.contract_period_start_date).strftime("%-d %b %Y")
    contract_period_end_date = (auction.contract_period_end_date).strftime("%-d %b %Y")
    total_volume = PdfUtils.number_helper.number_to_currency(auction.total_volume, precision: 0, unit: '')
    total_award_sum = PdfUtils.number_helper.number_to_currency(auction_result.total_award_sum, precision: 2, unit: '$ ')
    total_data = [["Contract Period: #{contract_period_start_date} to #{contract_period_end_date}"],
                  ["Total Volume: #{total_volume} kWh (forecasted)"],
                  ["Total Award Sum: #{total_award_sum} (forecasted)"]]

    pdf.table(total_data, :cell_style => {:width => pdf.bounds.right, :border_width => 0})
  end
end