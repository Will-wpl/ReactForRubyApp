class PdfTotalInfoV2 < PdfTotalInfo
  def get_contract_period_end_date(param)
    (param[:auction_result].contract_period_end_date).strftime("%-d %b %Y")
  end

  def get_total_volume(param)
    PdfUtils.number_helper.number_to_currency(param[:auction_result].total_volume, precision: 0, unit: '')
  end

  def info
    pdf = param[:pdf]
    contract_period_start_date = get_contract_period_start_date param
    contract_period_end_date = get_contract_period_end_date param
    total_volume = get_total_volume param
    total_award_sum = get_total_award_sum param
    total_data = [["Contract Period: #{contract_period_start_date} to #{contract_period_end_date}"],
                  ["Total Volume: #{total_volume} kWh (forecasted)"],
                  ]
    #["Total Award Sum: #{total_award_sum} (forecasted)"]
    pdf.table(total_data, :cell_style => {:width => pdf.bounds.right, :border_width => 0})
  end
end