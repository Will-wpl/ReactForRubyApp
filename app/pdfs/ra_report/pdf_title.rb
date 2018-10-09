class PdfTitle

  attr_reader :param

  def initialize(param)
    @param = param
  end

  def title
    pdf = param[:pdf]
    achieved = param[:achieved]
    auction = param[:auction]
    zone_time = param[:zone_time]
    pdf.cap_style = :round
    pdf.fill_color "ffffff"
    pdf.stroke_color "dddddd"
    pdf.fill_and_stroke {pdf.rounded_rectangle [0, pdf.bounds.top], pdf.bounds.absolute_right - 35, 50, 20}
    title1 = auction.name + " on " + (auction.start_datetime + zone_time).strftime("%-d %b %Y") #'D MMM YYYY'
    duration = ((auction.actual_end_time - auction.actual_begin_time) / 60).to_i
    title2 = (auction.actual_begin_time + zone_time).strftime("Start Time : %l:%M %p") + (auction.actual_end_time + zone_time).strftime(", End Time : %l:%M %p") + " Total Auction Duration : #{duration} minutes"


    pdf.fill_color Pdf::FONT_COLOR
    pdf.draw_text title1, :at => [15, pdf.bounds.top - 22]
    pdf.draw_text title2, :at => [15, pdf.bounds.top - 40]

    reserve_price = PdfUtils.number_helper.number_to_currency(auction.reserve_price.to_f, precision: 4, unit: '$', format: 'Reserve Price = %u %n /kWh' + ' ' * 6)

    achieved_str = achieved ? "Reserve Price Achieved" : "Reserve Price Not Achieved"
    achieved_color = achieved ? "228B22" : "FF0000"
    pdf.grid([0, 19], [1, 29]).bounding_box do
      pdf.formatted_text_box [
                                 {:text => reserve_price,
                                  :color => Pdf::FONT_COLOR,
                                  :size => 12},
                                 {:text => achieved_str,
                                  :color => achieved_color,
                                  :size => 12},
                             ], :at => [pdf.bounds.left, pdf.bounds.top - 21]
    end
    pdf.grid([0, 24], [1, 29]).bounding_box do
      achieved_img = if achieved
                       Rails.root.join("app", "assets", "pdf", "achieved.png")
                     else
                       Rails.root.join("app", "assets", "pdf", "not_achieved.png")
                     end
      pdf.image achieved_img, :width => 10, :height => 10, :at => [pdf.bounds.left + 16, pdf.bounds.top - 20]
    end
  end
end