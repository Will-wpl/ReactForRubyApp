
class PdfRankChart < PdfChart
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def chart
    # (pdf, len_x, base_x, number_x, number_y, str_time, step_number, ranking, hash, start_time_i,
    #     percentage_x, offset_x, user_company_name_hash, chart_color, type_x, uid)
    pdf = param[:pdf]
    user_company_name_hash = param[:user_company_name_hash]
    chart_color = param[:chart_color]
    uid = param[:uid]
    pdf.grid([12, 0], [22, 17]).bounding_box do
      # chart
      draw_chart
      # line
      chart_line
    end

    pdf.grid([13, 14], [22, 18]).bounding_box do
      pdf.move_down 5
      font_size = user_company_name_hash.keys().size > 20 ? 9 : 10
      uid.each {|user_id|
        pdf.font_size(font_size) {pdf.text user_company_name_hash[user_id], :color => chart_color[user_id], :valign => :center}
        pdf.move_down 12
      }
    end
  end

  def draw_chart

    pdf = param[:pdf]
    len_x = param[:len_x]
    base_x = param[:base_x]
    number_x = param[:number_x]
    number_y = param[:number_y]
    str_time = param[:str_time]
    step_number = param[:step_number]
    ranking = param[:ranking]

    pdf.move_down 10
    #stroke_axis
    pdf.stroke_color "ffffff"
    pdf.line_width = 1.0
    pdf.stroke do
      # X
      PdfUtils.draw_axis(param)
      (1..ranking).each do |i|
        pdf.horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0 / ranking) * i
        pdf.font_size(9) {pdf.text_box number_y[i], :at => [base_x - 60, 20 + (200 / ranking) * i + 3], :width => 55, :height => 10, :align => :right}
      end
      pdf.font_size(9) {pdf.text_box number_y[0], :at => [base_x - 60, 26], :width => 55, :height => 10, :align => :right}
    end
  end

  def get_y(item)
    ranking = param[:ranking]
    20 + (200.0 / ranking) * item.ranking
  end


end