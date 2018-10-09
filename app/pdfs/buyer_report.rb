class BuyerReport <Pdf
  attr_reader :param, :background_img, :pdf_filename

  def initialize(param)
    @param = param
    @background_img = Rails.root.join("app", "assets", "pdf", "bk.png")

    @pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
  end

  def pdf
    zone_time = get_pdf_datetime_zone
    auction, auction_result = param[:auction], param[:auction_result]
    if auction.nil? || auction_result.nil?
      return PdfUtils.get_no_data_pdf("LETTER", :portrait, 'NO_DATA_BUYER_REPORT.pdf')
    end
    current_user = param[:current_user]
    price_table_data, visibilities, price_data = get_price_table_data({:auction => auction, :auction_result => auction_result}, true, true)

    auction_name_date = auction.name + ' on ' + (auction.start_datetime + zone_time).strftime("%-d %b %Y")

    consumption_param = {
        :auction => auction,
        :visibilities => visibilities,
        :price_data => price_data,
        :user_id => current_user.id
    }
    consumption_table_data, total_volume, total_award_sum = get_consumption_table_data(consumption_param )
    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => background_img,
                             :page_size => "LETTER",
                             :page_layout => :portrait) do |pdf|
      pdf.fill_color "f3f6f7"
      pdf.fill { pdf.rounded_rectangle [-18, pdf.bounds.top+18], pdf.bounds.absolute_right-1, 756, 5}
      pdf.define_grid(:columns => 22, :rows => 35, :gutter => 1)

      # text PDF
      pdf_draw_title(pdf, auction)

      pdf.grid([4,1],[35,19]).bounding_box do
        #font "consola", :style => :bold_italic, :size => 14
        pdf.fill_color "000000"
        pdf.font_size(14) { pdf.draw_text "Reverse Auction  #{auction_name_date}.", :at => [pdf.bounds.left, pdf.bounds.top]}
        pdf.move_down 12
        pdf_auction_result_table({:pdf => pdf, :auction => auction, :auction_result => auction_result,
                                     :total_volume => total_volume, :total_award_sum => total_award_sum,
                                     :font_size => 14})
        pdf.move_down 15; pdf.fill_color "000000"
        pdf.table([["Price:"]], :cell_style => {:size => 16, :padding => [12,2],
                                                :inline_format => true, :width => pdf.bounds.right, :border_width => 0})
        pdf.move_down 12
        pdf_price_table(pdf, price_table_data)
        pdf.move_down 22
        pdf.table([["Consumption Forecast:"]], :cell_style => {:size => 16, :padding => [12,2],
                                                               :inline_format => true, :width => pdf.bounds.right, :border_width => 0})
        pdf.move_down 12
        pdf_consumption_table(pdf, consumption_table_data)
      end
    end
    return pdf_filename, auction.published_gid.to_s + '_BUYER_REPORT.pdf'
  end

  private

  def pdf_draw_title(pdf, auction)
    pdf.fill_color "000000"
    pdf.grid([1,1],[1,21]).bounding_box do
      pdf.font_size(26){
        pdf.draw_text "Buyer Report - #{auction.published_gid.to_s}", :at => [pdf.bounds.left, pdf.bounds.top-18]
      }
    end
  end

  def pdf_auction_result_table(param)
    pdf = param[:pdf]
    auction = param[:auction]
    auction_result = param[:auction_result]
    total_volume = param[:total_volume]
    total_award_sum = param[:total_award_sum]
    font_size = param[:font_size]

    unless auction_result.nil?
      lowest_price_bidder =  auction_result.status == nil ?  auction_result.company_name : auction_result.lowest_price_bidder
    end

    contract_period_start_date = (auction.contract_period_start_date).strftime("%-d %b %Y")
    contract_period_end_date = (auction.contract_period_end_date).strftime("%-d %b %Y")

    total_volume = PdfUtils.number_helper.number_to_currency(total_volume, precision: 0, unit: '')
    total_award_sum = PdfUtils.number_helper.number_to_currency(total_award_sum, precision: 2, unit: '$')
    table0_row0, table0_row1, table0_row2, table0_row3 =
        ["Winning Bidder:", lowest_price_bidder],
            ["Contract Period:", "#{contract_period_start_date} to #{contract_period_end_date}"],
            ["Total Volume:", total_volume + " kWh (forecasted)"],
            ["Total Award Sum:", total_award_sum + " (forecasted)"]
    auction_result_table = [table0_row0, table0_row1, table0_row2, table0_row3]

    col0_len = pdf.bounds.right/2-100
    col1_len = pdf.bounds.right - col0_len
    pdf.fill_color "000000"
    pdf.table(auction_result_table, :column_widths => [col0_len, col1_len],
              :cell_style => {:size => font_size, :padding => [12,2], :inline_format => true, :border_width => 0})
  end

  def pdf_price_table(pdf, price_table_data)
    pdf.table(price_table_data,
              :cell_style => {:size => 12,
                              :align => :center,
                              :valign => :center,
                              :padding => [8,2,14],
                              :inline_format => true,
                              :width => pdf.bounds.right/price_table_data[0].size,
                              :border_width => 0.01,:border_color => "dddddd"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "eeeeee"
    end
  end

  def pdf_consumption_table(pdf, consumption_table_data)
    pdf.table(consumption_table_data, :cell_style => {:size => 12,
                                                      :align => :center,
                                                      :valign => :center,
                                                      :padding => [8,2,14],
                                                      :inline_format => true,
                                                      :width => pdf.bounds.right/consumption_table_data[0].size,
                                                      :border_width => 0.01,
                                                      :border_color => "dddddd"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "eeeeee"
    end
  end

end