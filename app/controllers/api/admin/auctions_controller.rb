class Api::Admin::AuctionsController < Api::AuctionsController
  before_action :admin_required
  before_action :set_auction, only: %i[update publish hold confirm destroy]



  def pdf
    zone_time = pdf_datetime_zone

    start_time, end_time= params[:start_time], params[:end_time]
    start_time2, end_time2= params[:start_time2], params[:end_time2]
    start_price, end_price= params[:start_price], params[:end_price]
    uid, uid2= params[:uid], params[:uid2]
    color, color2 = params[:color], params[:color2]

    uid = uid.split(',').map!{|item| item = item.to_i} unless uid.nil?
    uid2 = uid2.split(',').map!{|item| item = item.to_i} unless uid2.nil?

    end_time, end_time2= datetime_millisecond(end_time), datetime_millisecond(end_time2)
    start_time, start_time2= datetime_millisecond(start_time, 0), datetime_millisecond(start_time2,0)

    auction_id = params[:id]
    background_img = Rails.root.join("app","assets", "pdf","bk.png")
    # step
    step_number = 6.0
    base_x = 30.0

    # datetime
    start_datetime, end_datetime = Time.parse(start_time),  Time.parse(end_time)
    start_time_i, end_time_i = start_datetime.to_i, end_datetime.to_i
    start_datetime2, end_datetime2 = Time.parse(start_time2),  Time.parse(end_time2)
    start_time2_i, end_time2_i= start_datetime2.to_i, end_datetime2.to_i
    # price
    min_price, max_price = start_price.to_f, end_price.to_f

    pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
    # select
    auction = Auction.find_by id:auction_id

    if auction.nil?
      send_no_data_pdf("B4", :landscape, 'NO_DATA_ADMIN_REPORT.pdf')
      return
    end

    auction_result, histories_achieved, achieved, histories, histories_2 =
        get_data(auction, start_time, end_time, min_price, end_price.to_f+0.00009, uid, start_time2, end_time2, uid2)
    #
    hash, user_company_name_hash = get_histories_hash(histories)
    hash2, user_company_name_hash2, ranking = get_histories_hash(histories_2, true)
    # chart 1 begin #
    percentage_x, type_x, len_x, time_format = time_le_3500(start_time_i, end_time_i)
    percentage_y = (max_price - min_price) / 200.0
    step_time = ((end_datetime.to_i-start_datetime.to_i)/step_number)
    step_price = (max_price - min_price) / step_number
    number_x, number_y, str_date, str_time = [], [], [], []
    number_x, str_date, str_time, len_x, offset_x =
        get_number_x(step_number, step_time, zone_time, start_datetime, start_time_i,
                     len_x, percentage_x, base_x, type_x, time_format)
    number_y = get_number_y(step_number, step_price, min_price)
    # chart 1 end #
    # chart 2 begin #
    percentage_x2, type_x2, len_x2, time_format2 = time_le_3500(start_time2_i, end_time2_i)
    step_time2 = ((end_datetime2.to_i-start_datetime2.to_i)/step_number)
    number_x2,number_y2, str_date2, str_time2= [], [], [], []
    number_x2, str_date2, str_time2, len_x2, offset_x2 =
        get_number_x(step_number, step_time2, zone_time, start_datetime2, start_time2_i,
                     len_x2, percentage_x2, base_x, type_x2, time_format2)

    (0..ranking).each do |i| number_y2[i] = i.to_s end
    # chart 2 end #
    chart_color = get_chart_color(hash, hash2, uid, color).merge get_chart_color(hash, hash2, uid2, color2)

    price_table = get_price_table_data(auction, auction_result)

    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => background_img,
                             :page_size => "B4",
                             :page_layout => :landscape) do |pdf|
      pdf.define_grid(:columns => 30, :rows => 23, :gutter => 2)
      #~ title
      pdf_title(pdf, achieved, auction, zone_time)
      #~ chart 1
      pdf_chart1(pdf, len_x, base_x, number_x, number_y, str_time, step_number, hash, start_time_i, percentage_x, offset_x,
                 min_price, percentage_y, user_company_name_hash, chart_color, type_x, uid)
      #~ chart 2
      pdf_chart2(pdf,len_x2, base_x, number_x2, number_y2, str_time2, step_number, ranking, hash2, start_time2_i,
                 percentage_x2, offset_x2, user_company_name_hash2, chart_color, type_x2, uid2)

      unless auction_result.nil?
        pdf.fill_color "ffffff"
        pdf.grid([2,19],[22,29]).bounding_box do
          pdf.move_down 10
          # lowest bidder info
          pdf_lowest_bidder_info(pdf, auction_result)
          pdf.move_down 15
          # price table
          pdf_price_table(pdf, price_table)
          pdf.move_down 15
          # total info
          pdf_total_info(pdf, auction, auction_result)
          pdf.move_down 15
          # ranking table
          pdf_ranking_table(pdf, histories_achieved)
        end
      end

    end
    send_pdf_data pdf_filename, auction.published_gid.to_s + '_ADMIN_REPORT.pdf'
  end



  private



  def get_data(auction, start_time, end_time, min_price, max_price, uid, start_time2, end_time2, uid2)
    auction_id = auction.id
    auction_result = AuctionResult.find_by_auction_id(auction_id)
    histories_achieved = AuctionHistory
                             .find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc, actual_bid_time asc ', auction_id]
    achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?
    histories = AuctionHistory
                    .select('users.id, users.name, users.company_name, auction_histories.*')
                    .joins(:user)
                    .where('auction_id = ? and bid_time BETWEEN ? AND ? and average_price BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time, end_time, min_price, max_price, uid)
                    .order(bid_time: :asc)
    histories_2 = AuctionHistory
                      .select('users.id, users.name, users.company_name, auction_histories.*')
                      .joins(:user)
                      .where('auction_id = ? and bid_time BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time2, end_time2, uid2)
                      .order(bid_time: :asc)
    return auction_result, histories_achieved, achieved, histories, histories_2
  end

  def datetime_millisecond(datetime, flag=1)
    unless datetime.index('.').nil?
      datetime[datetime.index('.'),6] = flag == 1 ? '.'+'9'*6+'Z':'.'+'0'*6+'Z'
    else
      datetime['Z'] = flag == 1 ? '.'+'9'*6+'Z':'.'+'0'*6+'Z'
    end
    datetime
  end

  def get_chart_color(user_hash, user_hash2, uid, color)
    unless color.nil?
      color = color.to_s.gsub(/#/,'').split(',')
      user_color_hash = {}
      uid.each_with_index {|user_id, index |
        user_color_hash[user_id] = index < color.size ? color[index]: get_color(user_hash, user_hash2)
      }
      user_color_hash
    else
      get_color(user_hash, user_hash2)
    end
  end

  def get_color(user_hash, user_hash2)
    user_hash = user_hash.clone
    temp_hash2 = user_hash2.clone
    temp_hash2.each {|key, list|
      user_hash[key] = list unless user_hash.has_key?(key)
    }

    #color = ["28FF28","9F35FF", "FF359A", "2828FF", "EAC100", "FF5809"]
    color = ['22ad38', 'ffff00', 'f53d0b', '8ff830', 'f13de8',
             '37b8ff', 'ffffff', 'ffc000' , '3366ff', '9933ff',
             '868686', '0ba55c', 'fa9106', 'ffafff', 'c00000',
             '46f0f0', '49702e', 'ffff99', '993300', '8e8cf4',
             '28FF28','9F35FF', 'FF359A', '2828FF', 'EAC100',
             'FF5809']
    user_color_hash = {}
    user_color_hash = if user_hash.size <= color.size
                        user_hash.keys().each_with_index do |key, index|
                          user_color_hash[key] = color[index]
                        end
                        user_color_hash
                      else
                        keys = user_hash.keys()
                        (color.size..keys.size-1).each do |item|
                          value = 0xff000000 | keys[item].to_s.hash
                          value = value.to_s(16)
                          color_value = value[value.size-6, 6]
                          color_value = value[1,6] if color.include?(color_value)
                          color.push(color_value)
                          user_color_hash[keys[item]] = color_value
                        end
                        user_color_hash
                      end
  end

  def time_le_3500(start_time_i, end_time_i)
    if end_time_i - start_time_i <= 3500.0
      percentage_x = 350.0 / (end_time_i - start_time_i )
      type_x = 0
      len_x = 5
      time_format = "%H:%M:%S.%L"
    else
      percentage_x = (end_time_i - start_time_i) / 350.0
      type_x = 1
      len_x = 0
      time_format = "%H:%M:%S"
    end
    return percentage_x, type_x, len_x, time_format
  end

  def get_histories_hash(histories, ranking = false)
    hash = {}
    user_company_name_hash = {}
    ranking = 0
    histories.each {|history|
      user_company_name_hash[history.user_id] = (history.company_name) unless user_company_name_hash.has_key?(history.user_id)
      hash[history.user_id] = [] unless hash.has_key?(history.user_id)
      hash[history.user_id].push(history)
      ranking = history.ranking if history.ranking > ranking
    }
    if ranking
      return hash, user_company_name_hash, ranking
    else
      return hash, user_company_name_hash
    end
  end

  def get_number_x(step_number, step_time, zone_time, start_datetime, start_time_i, len_x, percentage_x, base_x, type_x, time_format)
    number_x = []
    str_date = []
    str_time = []
    (1..step_number).each do |i|
      number_x[i] = if type_x == 0
                      ((start_datetime +  step_time*i).to_f - start_time_i) * percentage_x + base_x
                    else
                      ((start_datetime + step_time*i).to_f - start_time_i)/percentage_x
                    end

    end
    number_x[0] = number_x[1] - (number_x[2]-number_x[1])
    offset_x =  (base_x - number_x[0])

    (0..number_x.size - 1).each do |i|
      number_x[i] = number_x[i] + offset_x
    end

    is_int = true
    (1..number_x.size-1).each do |i|
      str_date[i] = (start_datetime + zone_time + step_time*i).strftime("%Y-%m-%d")
      str_time[i] = (start_datetime + zone_time + step_time*i).strftime(time_format)
      if type_x == 0 && is_int && str_time[i].split('.')[1] != '000'
        is_int = false
      end
    end
    start_datetime_zone =  start_datetime + zone_time
    str_date[0] = start_datetime_zone.strftime("%Y-%m-%d")
    str_time[0] = start_datetime_zone.strftime("%H:%M:%S.%L")
    if is_int
      len_x = 0
      (0..number_x.size-1).each do |i|
        str_time[i] = str_time[i].split('.')[0]
      end
    end
    return number_x, str_date, str_time, len_x, offset_x
  end

  def get_number_y(step_number, step_price, min_price)
    is_int = false
    number_y = []
    (1..step_number).each do |i|
      number_y[i] =  step_price * i + min_price #
      if number_y[i].to_i == number_y[i] && is_int == false
        is_int = true
      end
    end
    if is_int
      (1..step_number).each do |i|
        number_y[i] = number_y[i].round.to_s
      end
      number_y[0] = min_price.round.to_s
    else
      (1..step_number).each do |i|
        number_y[i] = ((number_y[i].to_f*10000.0).floor/(10000.0)).to_s
      end
      number_y[0] = ((min_price.to_f*10000.0).floor/(10000.0)).to_s
    end
    number_y
  end

  def pdf_title(pdf, achieved, auction, zone_time)
    pdf.cap_style = :round
    pdf.fill_color "183243"
    pdf.fill { pdf.rounded_rectangle [0, pdf.bounds.top], pdf.bounds.absolute_right-35, 50, 20 }
    title1 = auction.name + " on " + (auction.start_datetime + zone_time).strftime("%-d %b %Y") #'D MMM YYYY'
    duration = ((auction.actual_end_time - auction.actual_begin_time)/60).to_i
    title2 = (auction.actual_begin_time + zone_time).strftime("Start Time : %l:%M %p") + (auction.actual_end_time + zone_time).strftime(", End Time : %l:%M %p") + " Total Auction Duration : #{duration} minutes"


    pdf.fill_color "ffffff"
    pdf.draw_text title1, :at => [15, pdf.bounds.top-22]
    pdf.draw_text title2, :at => [15, pdf.bounds.top-40]

    auction_reserve_price = number_helper.number_to_currency(auction.reserve_price.to_f, precision: 4, unit: '')
    reserve_price = 'Reserve Price = $ '+ auction_reserve_price + ' /kWh' + ' '*6

    achieved_str = achieved ? "Reserve Price Achieved" : "Reserve Price Not Achieved"
    achieved_color = achieved ? "228B22" : "FF0000"
    pdf.grid([0,19],[1,29]).bounding_box do
      pdf.formatted_text_box [
                                 { :text => reserve_price,
                                   :color => "FFFFFF",
                                   :size => 12},
                                 { :text => achieved_str,
                                   :color => achieved_color,
                                   :size => 12},
                             ], :at => [pdf.bounds.left, pdf.bounds.top-21]
    end
    pdf.grid([0,24],[1,29]).bounding_box do
      achieved_img = if achieved
                       Rails.root.join("app","assets","pdf","achieved.png")
                     else
                       Rails.root.join("app","assets","pdf","not_achieved.png")
                     end
      pdf.image achieved_img, :width => 10, :height => 10, :at => [pdf.bounds.left+16, pdf.bounds.top-20]
    end
  end

  def pdf_chart1(pdf, len_x, base_x, number_x, number_y, str_time, step_number, hash, start_time_i, percentage_x, offset_x,
                 min_price, percentage_y, user_company_name_hash, chart_color, type_x, uid)
    pdf.grid([2,0],[11,13]).bounding_box do
      # chart
      pdf_draw_chart1(pdf, len_x, base_x,step_number, number_x, number_y, str_time)
      # line
      pdf_chart1_line(pdf, hash, chart_color, start_time_i, percentage_x, base_x, offset_x, type_x, min_price, percentage_y)
    end

    pdf.grid([2,14],[11,18]).bounding_box do
      pdf.move_down 5
      font_size = user_company_name_hash.keys().size > 20 ? 9 : 10
      pdf.fill_color "ffffff"
      uid.each {|user_id|
        pdf.font_size(font_size) {pdf.text user_company_name_hash[user_id], :color => chart_color[user_id], :valign => :center }
        pdf.move_down 12
      }
    end
  end

  def pdf_chart1_line(pdf, hash, chart_color, start_time_i, percentage_x, base_x, offset_x, type_x, min_price, percentage_y)
    point_hash = {}
    hash.each_with_index do |(key, list), index|
      point_hash[key] = []
      pdf.stroke do
        pdf.line_width = 1.5
        pdf.stroke_color chart_color[key]
        list.each_with_index {|item, item_index|
          # x, y
          data_x = if type_x == 0 then
                     ((item.bid_time.to_i - start_time_i) * percentage_x).to_f + base_x + offset_x
                   else
                     data_x = (item.bid_time.to_i - start_time_i) / percentage_x
                     data_x == 0 ? base_x : data_x + offset_x
                   end
          data_y = (item.average_price - min_price)/percentage_y + 20.0
          if item_index == 0
            pdf.move_to data_x, data_y
          else
            pdf.line_to data_x, data_y
          end
          point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
        }
      end
    end

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

  def pdf_draw_chart1(pdf, len_x, base_x,step_number, number_x, number_y, str_time)
    pdf.move_down 10
    #stroke_axis
    pdf.stroke_color "ffffff"
    pdf.stroke do
      # Y
      pdf.vertical_line 20, 20+210, :at => number_x[0]
      # X
      pdf.horizontal_line number_x[0], number_x[0] + 360, :at => 20

      (1..number_x.size-1).each do |i|
        pdf.vertical_line 20, 25, :at => number_x[i]
        #font_size(7) { text_box str_date[i], :at => [base_x + (350.0/step_number)*i-14, 20-4]}
        #font_size(7) { text_box str_time[i], :at => [base_x + (350.0/step_number)*i-12-len_x, 20-10]}
        pdf.font_size(8) { pdf.text_box str_time[i], :at => [base_x + (350.0/step_number)*i-14-len_x, 20-5]}
      end
      #font_size(7) { text_box str_date[0], :at => [base_x-12, 20-3]}
      #font_size(7) { text_box str_time[0], :at => [base_x-12-len_x, 20-10]}
      pdf.font_size(8) { pdf.text_box str_time[0], :at => [base_x-14-len_x, 20-5]}

      (1..step_number).each do |i|
        pdf.horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0/step_number) * i
        pdf.font_size(9) { pdf.text_box number_y[i], :at => [base_x-60, 20 + (200/step_number)*i + 3],:width => 55,:height => 10, :align => :right}
      end
      pdf.font_size(9) { pdf.text_box number_y[0], :at => [base_x-60, 26],:width => 55,:height => 10, :align => :right}
    end
  end

  def pdf_chart2(pdf,len_x, base_x, number_x, number_y, str_time, step_number, ranking, hash, start_time_i,
                 percentage_x, offset_x, user_company_name_hash, chart_color, type_x, uid)
    pdf.grid([12,0],[22,17]).bounding_box do
      # chart
      pdf_draw_chart2(pdf, number_x, number_y, str_time, base_x, step_number, len_x, ranking)
      # line
      pdf_chart2_line(pdf, hash, start_time_i, percentage_x, base_x , offset_x, ranking, chart_color, type_x)
    end

    pdf.grid([13,14],[22,18]).bounding_box do
      pdf.move_down 5
      font_size = user_company_name_hash.keys().size > 20 ? 9 : 10
      uid.each {|user_id|
        pdf.font_size(font_size) {pdf.text user_company_name_hash[user_id], :color => chart_color[user_id], :valign => :center }
        pdf.move_down 12
      }
    end
  end

  def pdf_draw_chart2(pdf, number_x, number_y, str_time, base_x, step_number, len_x, ranking)
    pdf.move_down 10
    #stroke_axis
    pdf.stroke_color "ffffff"
    pdf.line_width = 1.0
    pdf.stroke do
      # X
      pdf.vertical_line 20, 20+210, :at => number_x[0]
      # Y
      pdf.horizontal_line number_x[0], number_x[0] + 360, :at => 20

      (1..number_x.size-1).each do |i|
        pdf.vertical_line 20, 25, :at => number_x[i]
        #font_size(7) { text_box str_date2[i], :at => [base_x + (350.0/step_number)*i-14, 20-4]}
        #font_size(7) { text_box str_time[i], :at => [base_x + (350.0/step_number)*i-12-len_x, 20-10]}
        pdf.font_size(8) { pdf.text_box str_time[i], :at => [base_x + (350.0/step_number)*i-14-len_x, 20-5]}
      end
      #font_size(7) { text_box str_date2[0], :at => [base_x-12, 20-3]}
      #font_size(7) { text_box str_time[0], :at => [base_x-12-len_x, 20-10]}
      pdf.font_size(8) { pdf.text_box str_time[0], :at => [base_x-14-len_x, 20-5]}

      (1..ranking).each do |i|
        pdf.horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0/ranking) * i
        pdf.font_size(9) { pdf.text_box number_y[i], :at => [base_x-60, 20 + (200/ranking)*i + 3],:width => 55,:height => 10, :align => :right}
      end
      pdf.font_size(9) { pdf.text_box number_y[0], :at => [base_x-60, 26],:width => 55,:height => 10, :align => :right}
    end
  end

  def pdf_chart2_line(pdf, hash, start_time_i, percentage_x, base_x , offset_x, ranking, chart_color, type_x)
    point_hash = {}
    hash.each_with_index do |(key, list), index|
      point_hash[key] = []
      pdf.stroke do
        pdf.line_width = 1.5
        pdf.stroke_color chart_color[key]
        list.each_with_index {|item, item_index|
          data_x = if type_x == 0
                     ((item.bid_time.to_i - start_time_i) * percentage_x).to_f + base_x + offset_x
                   else
                     data_x =	(item.bid_time.to_i - start_time_i) / percentage_x
                     data_x == 0 ? base_x : data_x + offset_x
                   end
          data_y = 20 + (200.0/ranking) * item.ranking
          if item_index == 0
            pdf.move_to data_x, data_y
          else
            pdf.line_to data_x, data_y
          end
          point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
        }
      end
    end

    #point
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

  def pdf_lowest_bidder_info(pdf, auction_result)
    unless auction_result.status.nil?
      if auction_result.status == 'win'
        status, status_color = 'Awarded', '228B22'
        bidder_text, bidder_text2, bidder_text3 = 'Summary of Winner', 'Winning Bidder', 'Average Price'
      else
        status, status_color = 'Void', 'dd0000'
        bidder_text, bidder_text2, bidder_text3 = 'Summary of Lowest Bidder','Lowest Price Bidder', 'Lowest Average Price:'
      end
      lowest_price_bidder = auction_result.lowest_price_bidder
      lowest_average_price = number_helper.number_to_currency(auction_result.lowest_average_price.to_f, precision: 4, unit: '')
    else
      status, status_color = 'Void', 'dd0000'
      bidder_text, bidder_text2, bidder_text3 = 'Summary of Lowest Bidder','Lowest Price Bidder', 'Lowest Average Price:'
      lowest_price_bidder = auction_result.lowest_price_bidder
      lowest_average_price = number_helper.number_to_currency(auction_result.lowest_average_price.to_f, precision: 4, unit: '')
    end
    bidder_table = [ ["<font size='18'><color rgb='#{status_color}'>Status: #{status}</color></font>"],
                [bidder_text],
                ["#{bidder_text2}: #{lowest_price_bidder}"],
                ["#{bidder_text3}: $ #{lowest_average_price}/kWh"] ]
    pdf.table(bidder_table, :cell_style => {:inline_format => true, :width => pdf.bounds.right, :border_width => 0})
  end

  def pdf_price_table(pdf, price_table)
    pdf.table(price_table, :header => true, :cell_style => {:size => 9, :align => :center, :padding => [11,2], :inline_format => true, :width => pdf.bounds.right/price_table[0].size, :border_width => 0.01,:border_color => "424242"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def pdf_total_info(pdf, auction, auction_result)
    contract_period_start_date = (auction.contract_period_start_date).strftime("%d %b %Y")
    contract_period_end_date = (auction.contract_period_end_date).strftime("%d %b %Y")
    total_volume = number_helper.number_to_currency(auction.total_volume, precision: 0, unit: '')
    total_award_sum = number_helper.number_to_currency(auction_result.total_award_sum, precision: 2, unit: '$ ')
    total_data = [ ["Contract Period: #{contract_period_start_date} to #{contract_period_end_date}"],
              ["Total Volume: #{total_volume} kWh (forecasted)"],
              ["Total Award Sum: #{total_award_sum} (forecasted)"] ]

    pdf.table(total_data, :cell_style => {:width => pdf.bounds.right, :border_width => 0})
  end

  def pdf_ranking_table(pdf, histories_achieved)
    ranking_table = [
        ["<b>Rank</b>","<b>Retailer</b>", "<b>Average Price</b>"] ]
    is_bidder_index = -1
    histories_achieved.each_with_index {|item, index|
      ranking_table_row = []
      ranking_table_row.push(item.ranking)
      ranking_table_row.push(item.company_name)
      ranking_table_row.push('$ '+number_helper.number_to_currency(item.average_price.to_f, precision: 4, unit: '')+'/kWh')
      ranking_table.push(ranking_table_row)
      is_bidder_index = index+1 if item.is_bidder
    }
    pdf.table [["Retailer Ranking"]], :cell_style => {:size => 18, :inline_format => true, :width => pdf.bounds.right, :border_width => 0}
    pdf.table(ranking_table, :header => true, :cell_style => {:size => 9, :align => :center, :padding => [11,2], :inline_format => true, :width => pdf.bounds.right/3,  :border_width => 0.01,:border_color => "424242"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
      values = cells.columns(0..-1).rows(is_bidder_index..is_bidder_index)
      values.background_color = "228B22"
    end
  end
end
