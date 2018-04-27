
class PdfChart

  def get_x(item)
    base_x = param[:base_x]
    start_time_i = param[:start_time_i]
    percentage_x = param[:percentage_x]
    offset_x = param[:offset_x]
    type_x = param[:type_x]
    if type_x == 0 then
      ((item.bid_time.to_i - start_time_i) * percentage_x).to_f + base_x + offset_x
    else
      data_x = (item.bid_time.to_i - start_time_i) / percentage_x
      data_x == 0 ? base_x : data_x + offset_x
    end
  end

  def chart_line
    pdf = param[:pdf]
    chart_color = param[:chart_color]
    point_hash = draw_line
    #point polygon/ellipse
    pdf.stroke do
      point_hash.each_with_index do |(key, list), index|
        pdf.fill_color chart_color[key]
        list.each {|item|
          if item[:is_bidder]
            pdf.fill_polygon [item[:point_x], item[:point_y] + 4], [item[:point_x] + 4, item[:point_y] - 2], [item[:point_x] - 4, item[:point_y] - 2]
          else
            pdf.fill_ellipse [item[:point_x], item[:point_y]], 2.5
          end
        }
      end
    end
  end

  def get_y(item);

  end

  def draw_line
    hash = param[:hash]
    chart_color = param[:chart_color]
    pdf = param[:pdf]
    point_hash = {}
    hash.each_with_index do |(key, list), index|
      point_hash[key] = []
      pdf.stroke do
        pdf.line_width = 1.5
        pdf.stroke_color chart_color[key]
        list.each_with_index {|item, item_index|
          # x, y
          data_x = get_x(item)
          data_y = get_y(item)
          if item_index == 0
            pdf.move_to data_x, data_y
          else
            pdf.line_to data_x, data_y
          end
          point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
        }
      end
    end
    point_hash
  end
end