class PdfPriceTable

  attr_reader :param

  def initialize(param)
    @param = param
  end

  def table
    pdf = param[:pdf]
    price_table = param[:price_table]
    pdf.table(price_table, :header => true, :cell_style => {:size => 9, :align => :center, :valign => :center, :padding => [8, 2, 14], :inline_format => true, :width => pdf.bounds.right / price_table[0].size, :border_width => 0.01, :border_color => "dddddd"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "eeeeee"
    end
  end
end