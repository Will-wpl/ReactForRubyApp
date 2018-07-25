class PdfTotalInfoV2 < PdfTotalInfo
  def get_contract_period_end_date(param)
    (param[:auction_result].contract_period_end_date).strftime("%-d %b %Y")
  end
end