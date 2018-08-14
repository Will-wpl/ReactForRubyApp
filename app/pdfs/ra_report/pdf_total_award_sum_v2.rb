class PdfTotalAwardSumV2 < PdfTotalInfo
  def info
    pdf = param[:pdf]
    total_award_sum = get_total_award_sum param
    total_data = [["Total Award Sum: #{total_award_sum} (forecasted)"]]
    pdf.table(total_data, :cell_style => {:width => pdf.bounds.right, :border_width => 0})
  end
end