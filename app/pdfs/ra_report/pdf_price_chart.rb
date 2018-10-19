

class PdfPriceChart < PdfChart
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def chart
    pdf = param[:pdf]
    user_company_name_hash = param[:user_company_name_hash]
    chart_color = param[:chart_color]
    uid = param[:uid]
    pdf.grid([2, 0], [11, 13]).bounding_box do
      # chart
      draw_chart
      # line
      chart_line
    end
    pdf.grid([2, 13], [11, 18]).bounding_box do
      pdf.fill_color "ffffff"
      name_string  = ""
      uid.each {|user_id|
        name_string += get_name_string(user_company_name_hash[user_id] , chart_color[user_id])
      }
      pdf.font_size(get_font_size(user_company_name_hash.keys().size)) {pdf.text name_string,  :inline_format => true, :valign => :center}
    end
  end

  def draw_chart
    pdf = param[:pdf]
    base_x = param[:base_x]
    number_x = param[:number_x]
    number_y = param[:number_y]
    step_number = param[:step_number]
    pdf.move_down 10
    #stroke_axis
    pdf.stroke_color "000000"
    pdf.stroke do
      # X Y
      PdfUtils.draw_axis(param)

      (1..step_number).each do |i|
        pdf.horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0 / step_number) * i
        pdf.font_size(9) {pdf.text_box number_y[i], :at => [base_x - 60, 20 + (200 / step_number) * i + 3], :width => 55, :height => 10, :align => :right}
      end
      pdf.font_size(9) {pdf.text_box number_y[0], :at => [base_x - 60, 26], :width => 55, :height => 10, :align => :right}
    end
  end

  def get_y(item)
    min_price = param[:min_price]
    percentage_y = param[:percentage_y]
    (item.average_price - min_price) / percentage_y + 20.0
  end

end