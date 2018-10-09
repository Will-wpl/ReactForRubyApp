class PdfTitleV2

  attr_reader :param

  def initialize(param)
    @param = param
  end

  def title
    zone_time = param[:zone_time]
    pdf = param[:pdf]
    auction = param[:auction]
    pdf.cap_style = :round
    pdf.fill_color "ffffff"
    pdf.stroke_color "dddddd"
    pdf.fill_and_stroke {pdf.rounded_rectangle [0, pdf.bounds.top], pdf.bounds.absolute_right - 35, 50, 20}
    text1 = auction.name + " on " + (auction.start_datetime + zone_time).strftime("%-d %b %Y") #'D MMM YYYY'
    duration = ((auction.actual_end_time - auction.actual_begin_time) / 60).to_i
    text2 = (auction.actual_begin_time + zone_time).strftime("Start Time : %l:%M %p") + (auction.actual_end_time + zone_time).strftime(", End Time : %l:%M %p") + " Total Auction Duration : #{duration} minutes"


    pdf.fill_color Pdf::FONT_COLOR
    pdf.draw_text text1, :at => [15, pdf.bounds.top - 22]
    pdf.draw_text text2, :at => [15, pdf.bounds.top - 40]

  end
end