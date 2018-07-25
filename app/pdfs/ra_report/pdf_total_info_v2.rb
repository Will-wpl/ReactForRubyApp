class PdfTotalInfoV2 < PdfTotalInfo
  def get_contract_period_end_date(param)
    (param[:auction_result].contract_period_end_date).strftime("%-d %b %Y")
  end

  def get_total_volume(param)
    PdfUtils.number_helper.number_to_currency(param[:auction_result].total_volume, precision: 0, unit: '')
  end
end