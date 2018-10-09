class PdfRankingTable
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def table
    pdf = param[:pdf]
    histories_achieved = param[:histories_achieved]
    ranking_table = [
        ["<b>Rank</b>", "<b>Retailer</b>", "<b>Average Price</b>"]]
    is_bidder_index = -1
    histories_achieved.each_with_index {|item, index|
      ranking_table_row = []
      ranking_table_row.push(item.ranking)
      ranking_table_row.push(item.company_name)
      ranking_table_row.push(PdfUtils.number_helper.number_to_currency(item.average_price.to_f, precision: 4, unit: '$', format: '%u %n/kWh'))
      ranking_table.push(ranking_table_row)
      is_bidder_index = index + 1 if item.is_bidder
    }
    pdf.table [["Retailer Ranking"]], :cell_style => {:size => 16, :inline_format => true, :width => pdf.bounds.right, :border_width => 0}

    col0_width = pdf.bounds.right / 3.0 - 50.0
    #col1_width = (pdf.bounds.right - col0_width)/2.0 + 20.0
    #col2_width = pdf.bounds.right - col0_width - col1_width
    #[col0_width, col1_width, col2_width]
    pdf.table(ranking_table, :column_widths => {0 => col0_width}, :width => pdf.bounds.right, :header => true, :cell_style => {:size => 9, :align => :center, :valign => :center, :padding => [8, 2, 14], :inline_format => true, :border_width => 0.01, :border_color => "dddddd"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "eeeeee"
      #~ highlight
      #values = cells.columns(0..-1).rows(is_bidder_index..is_bidder_index)
      #values.background_color = "228B22"
    end
  end
end