class Api::Admin::AuctionsController < Api::AuctionsController
  before_action :admin_required
  before_action :set_auction, only: %i[update publish hold confirm destroy]

  def pdf
    zone_time = pdf_datetime_zone
    start_time = params[:start_time]
    end_time = params[:end_time]
    start_time2 = params[:start_time2]
    end_time2 = params[:end_time2]
    start_price = params[:start_price]
    end_price = params[:end_price]
    uid = params[:uid]
    uid2 = params[:uid2]

    unless uid.nil?
      uid = uid.split(',').map!{|item| item = item.to_i}
    end
    unless uid2.nil?
      uid2 = uid2.split(',').map!{|item| item = item.to_i}
    end

    unless end_time.index('.').nil?
      end_time[end_time.index('.'),6] = '.999Z'
    else
      end_time['Z'] = '.999Z'
    end
    unless end_time2.index('.').nil?
      end_time2[end_time2.index('.'),6] = '.999Z'
    else
      end_time2['Z'] = '.999Z'
    end

    auction_id = params[:id]
    background_img = Rails.root.join("app","assets", "pdf","bk.png")
    #####
    step_number = 6.0
    base_x = 30.0
    #####
    start_datetime = Time.parse(start_time)
    end_datetime = Time.parse(end_time)
    start_time_i = start_datetime.to_i
    end_time_i = end_datetime.to_i

    start_datetime2 = Time.parse(start_time2)
    end_datetime2 = Time.parse(end_time2)
    start_time2_i = start_datetime2.to_i
    end_time2_i = end_datetime2.to_i

    max_price = end_price.to_f
    min_price = start_price.to_f

    pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
    # select
    auction = Auction.find_by id:auction_id
    if auction.nil?
      send_no_data_pdf("B4", :landscape)
      return
    end
    auction_result = AuctionResult.find_by_auction_id(auction_id)

    histories_achieved = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc, actual_bid_time asc ', auction_id]
    achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?

    histories = AuctionHistory.select('users.id, users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and bid_time BETWEEN ? AND ? and average_price BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time, end_time, min_price, max_price, uid).order(bid_time: :asc)
    histories_2 = AuctionHistory.select('users.id, users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and bid_time BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time2, end_time2, uid2).order(bid_time: :asc)
    #
    hash, user_company_name_hash = get_histories_hash(histories)
    hash2, user_company_name_hash2, ranking = get_histories_hash(histories_2, true)
    ##### chart 1 begin #####
    tmp_x, type_x, len_x, time_format = time_le_3500(start_time_i, end_time_i)
    tmp_y = (max_price - min_price) / 200.0
    step_time = ((end_datetime.to_i-start_datetime.to_i)/step_number)
    step_price = (max_price - min_price) / step_number
    number_x = []
    number_y = []
    str_date = []
    str_time = []
    # number_x begin
    number_x, str_date, str_time, len_x, offset_x = get_number_x(step_number, step_time, zone_time, start_datetime, start_time_i, len_x, tmp_x, base_x, type_x, time_format)
    # number_x end

    # number_y begin
    number_y = get_number_y(step_number, step_price, min_price)
    # number_y end
    ##### chart 1 end #####
    ##### chart 2 begin ######
    tmp_x2, type_x2, len_x2, time_format2 = time_le_3500(start_time2_i, end_time2_i)
    step_time2 = ((end_datetime2.to_i-start_datetime2.to_i)/step_number)
    number_x2 = []
    str_date2 = []
    str_time2 = []
    # number_x begin
    number_x2, str_date2, str_time2, len_x2, offset_x2 = get_number_x(step_number, step_time2, zone_time, start_datetime2, start_time2_i, len_x2, tmp_x2, base_x, type_x2, time_format2)
    # number_x end
    number_y2 = []
    (0..ranking).each do |i|
      number_y2[i] = i.to_s
    end
    ##### chart 2 end #####
    user_all_hash = hash.clone
    temp_hash2 = hash2.clone
    temp_hash2.each {|key, list|
      user_all_hash[key] = list unless user_all_hash.has_key?(key)
    }
    chart_color = get_chart_color(user_all_hash)
    ######
    price_table = get_price_table_data(auction, auction_result)

    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => background_img,
                             :page_size => "B4",
                             :page_layout => :landscape) do
      define_grid(:columns => 30, :rows => 23, :gutter => 2)
      self.cap_style = :round
      fill_color "183243"
      fill { rounded_rectangle [0, bounds.top], bounds.absolute_right-35, 50, 20 }
      title1 = auction.name + " on " + (auction.start_datetime + zone_time).strftime("%d %b %Y") #'D MMM YYYY'
      duration = ((auction.actual_end_time - auction.actual_begin_time)/60).to_i
      title2 = "Start Time : " + (auction.actual_begin_time + zone_time).strftime("%I:%M %p") + " End Time : " + (auction.actual_end_time + zone_time).strftime("%I:%M %p") + " Total Auction Duration : #{duration} minutes"


      fill_color "ffffff"
      draw_text title1, :at => [15, bounds.top-22]
      draw_text title2, :at => [15, bounds.top-40]

      reserve_price = "Reserve Price = $ "+ auction.reserve_price.to_s + " /kWh" + "      "

      achieved_str = achieved ? "Reserve Price Achieved" : "Reserve Price Not Achieved"
      achieved_color = achieved ? "228B22" : "FF0000"
      grid([0,19],[1,29]).bounding_box do
        formatted_text_box [
                               { :text => reserve_price,
                                 :color => "FFFFFF"},
                               { :text => achieved_str,
                                 :color => achieved_color},
                           ], :at => [bounds.left, bounds.top-21]
      end


      grid([0,24],[1,29]).bounding_box do
        achieved_img = if achieved
                         Rails.root.join("app","assets","pdf","achieved.png")
                       else
                         Rails.root.join("app","assets","pdf","not_achieved.png")
                       end
        image achieved_img, :width => 10, :height => 10, :at => [bounds.left+16, bounds.top-20]
      end

      #~ chart 1 begin#
      grid([2,0],[11,13]).bounding_box do
        move_down 10
        #stroke_axis

        stroke_color "ffffff"
        stroke do
          # X
          vertical_line 20, 20+210, :at => number_x[0]
          # Y
          horizontal_line number_x[0], number_x[0] + 360, :at => 20

          (1..number_x.size-1).each do |i|
            vertical_line 20, 25, :at => number_x[i]
            #font_size(7) { text_box str_date[i], :at => [base_x + (350.0/step_number)*i-14, 20-4]}
            #font_size(7) { text_box str_time[i], :at => [base_x + (350.0/step_number)*i-12-len_x, 20-10]}
            font_size(8) { text_box str_time[i], :at => [base_x + (350.0/step_number)*i-14-len_x, 20-5]}
          end
          #font_size(7) { text_box str_date[0], :at => [base_x-12, 20-3]}
          #font_size(7) { text_box str_time[0], :at => [base_x-12-len_x, 20-10]}
          font_size(8) { text_box str_time[0], :at => [base_x-14-len_x, 20-5]}

          (1..step_number).each do |i|
            horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0/step_number) * i
            font_size(9) { text_box number_y[i], :at => [base_x-60, 20 + (200/step_number)*i + 3],:width => 55,:height => 10, :align => :right}
          end
          font_size(9) { text_box number_y[0], :at => [base_x-60, 26],:width => 55,:height => 10, :align => :right}
        end

        # line
        point_hash = {}

        hash.each_with_index do |(key, list), index|
          point_hash[key] = []
          stroke do
            self.line_width = 1.5
            stroke_color chart_color[key]
            list.each_with_index {|item, item_index|
              # point x, y begin
              data_x = if type_x == 0 then
                         ((item.bid_time.to_i - start_time_i) * tmp_x).to_f + base_x + offset_x
                       else
                         data_x = (item.bid_time.to_i - start_time_i) / tmp_x
                         data_x == 0 ? base_x : data_x + offset_x
                       end
              data_y = (item.average_price - min_price)/tmp_y + 20.0
              # point x, y end
              if item_index == 0
                move_to data_x, data_y
              else
                line_to data_x, data_y
              end
              point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
            }
          end
        end

        #point polygon/ellipse
        stroke do
          point_hash.each_with_index do |(key, list), index|
            fill_color chart_color[key]
            list.each {|item|
              if item[:is_bidder]
                fill_polygon [item[:point_x], item[:point_y] + 4], [item[:point_x] + 4, item[:point_y] - 2], [item[:point_x] - 4, item[:point_y] - 2]
              else
                fill_ellipse [item[:point_x], item[:point_y]], 2.5
              end
            }
          end
        end
      end

      grid([2,14],[11,18]).bounding_box do
        move_down 5
        font_size = user_company_name_hash.keys().size > 20 ? 9 : 10
        fill_color "ffffff"
        user_company_name_hash.each do |id,name|
          font_size(font_size) {text name, :color => chart_color[id] }
          move_down 1
        end
      end
      #~ chart 1 end#
      #~ chart 2 begin#
      grid([12,0],[22,17]).bounding_box do
        move_down 10
        #stroke_axis
        stroke_color "ffffff"
        self.line_width = 1.0
        stroke do
          # X
          vertical_line 20, 20+210, :at => number_x2[0]
          # Y
          horizontal_line number_x2[0], number_x2[0] + 360, :at => 20

          (1..number_x2.size-1).each do |i|
            vertical_line 20, 25, :at => number_x2[i]
            #font_size(7) { text_box str_date2[i], :at => [base_x + (350.0/step_number)*i-14, 20-4]}
            #font_size(7) { text_box str_time2[i], :at => [base_x + (350.0/step_number)*i-12-len_x2, 20-10]}
            font_size(8) { text_box str_time2[i], :at => [base_x + (350.0/step_number)*i-14-len_x2, 20-5]}
          end
          #font_size(7) { text_box str_date2[0], :at => [base_x-12, 20-3]}
          #font_size(7) { text_box str_time2[0], :at => [base_x-12-len_x2, 20-10]}
          font_size(8) { text_box str_time2[0], :at => [base_x-14-len_x2, 20-5]}

          (1..ranking).each do |i|
            horizontal_line number_x2[0], number_x2[0] + 5, :at => 20 + (200.0/ranking) * i
            font_size(9) { text_box number_y2[i], :at => [base_x-60, 20 + (200/ranking)*i + 3],:width => 55,:height => 10, :align => :right}
          end
          font_size(9) { text_box number_y2[0], :at => [base_x-60, 26],:width => 55,:height => 10, :align => :right}
        end

        point_hash = {}
        hash2.each_with_index do |(key, list), index|
          point_hash[key] = []
          stroke do
            self.line_width = 1.5
            stroke_color chart_color[key]
            list.each_with_index {|item, item_index|
              data_x = if type_x == 0
                         ((item.bid_time.to_i - start_time2_i) * tmp_x2).to_f + base_x + offset_x2
                       else
                         data_x =	(item.bid_time.to_i - start_time2_i) / tmp_x2
                         data_x == 0 ? base_x : data_x + offset_x2
                       end
              data_y = 20 + (200.0/ranking) * item.ranking
              if item_index == 0
                move_to data_x, data_y
              else
                line_to data_x, data_y
              end
              point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
            }
          end
        end

        #point
        stroke do
          point_hash.each_with_index do |(key, list), index|
            fill_color chart_color[key]
            list.each {|item|
              if item[:is_bidder]
                fill_polygon [item[:point_x], item[:point_y] + 4], [item[:point_x] + 4, item[:point_y] - 2], [item[:point_x] - 4, item[:point_y] - 2]
              else
                fill_ellipse [item[:point_x], item[:point_y]], 2.5
              end
            }
          end
        end
      end

      grid([13,14],[22,18]).bounding_box do
        move_down 5
        font_size = user_company_name_hash2.keys().size > 20 ? 9 : 10
        user_company_name_hash2.each do |id, name|
          fill_color "ffffff"
          font_size(font_size) {text name, :color => chart_color[id] }
          move_down 1

        end
      end
      #~ chart 2 end#
      fill_color "ffffff"
      #grid.show_all
      # data0 begin
      unless auction_result.nil?
        unless auction_result.status.nil?
          if auction_result.status == 'win'
            status, status_color = 'Awarded', "228B22"
          else
            status, status_color = 'Void', "dd0000"
          end
          lowest_price_bidder = auction_result.lowest_price_bidder
          lowest_average_price = format("%.4f",auction_result.lowest_average_price)
        else
          if auction_result.is_bidder
            status, status_color = 'Awarded', "228B22"
          else
            status, status_color= 'Not Awarded', "dd0000"
          end
          lowest_price_bidder = auction_result.company_name
          lowest_average_price = format("%.4f",auction_result.average_price)
        end
        #~ data0 end

        contract_period_start_date = (auction.contract_period_start_date).strftime("%d %b %Y")
        contract_period_end_date = (auction.contract_period_end_date).strftime("%d %b %Y")


        data0 = [ ["<font size='18'><color rgb='#{status_color}'>Status: #{status}</color></font>"],
                  ["Summary Of Lowest Bidder"],
                  ["Lowest Price Bidder:#{lowest_price_bidder}"],
                  ["Lowest Average Price:$ #{lowest_average_price}/kWh"] ]

        total_volume = ActiveSupport::NumberHelper.number_to_currency(auction.total_volume, precision: 0, unit: '')
        total_award_sum = ActiveSupport::NumberHelper.number_to_currency(auction_result.total_award_sum, precision: 2, unit: '$ ')
        data1 = [ ["Contract Period: #{contract_period_start_date} to #{contract_period_end_date}"],
                  ["Total Volume: #{total_volume} kWh (forecasted)"],
                  ["Total Award Sum: #{total_award_sum} (forecasted)"] ]
        table1 = [
            ["<b>Rank</b>","<b>Retailer</b>", "<b>Average Price</b>"] ]
        is_bidder_index = -1
        histories_achieved.each_with_index {|item, index|
          table1_row = []
          table1_row.push(item.ranking)
          table1_row.push(item.company_name)
          table1_row.push('$ '+format("%.4f",item.average_price)+'/kWh')
          table1.push(table1_row)
          is_bidder_index = index+1 if item.is_bidder
        }

        grid([2,19],[22,29]).bounding_box do
          move_down 10
          table(data0, :cell_style => {:inline_format => true, :width => bounds.right, :border_width => 0})
          move_down 15
          table(price_table, :header => true, :cell_style => {:size => 9, :align => :center, :padding => [11,2], :inline_format => true, :width => bounds.right/price_table[0].size, :border_width => 0.01,:border_color => "424242"}) do
            values = cells.columns(0..-1).rows(0..0)
            values.background_color = "00394A"
          end
          move_down 15
          table(data1, :cell_style => {:width => bounds.right, :border_width => 0})
          move_down 15
          table [["Retailer Ranking"]], :cell_style => {:size => 18, :inline_format => true, :width => bounds.right, :border_width => 0}

          table(table1, :header => true, :cell_style => {:size => 9, :align => :center, :padding => [11,2], :inline_format => true, :width => bounds.right/3,  :border_width => 0.01,:border_color => "424242"}) do
            values = cells.columns(0..-1).rows(0..0)
            values.background_color = "00394A"
            values = cells.columns(0..-1).rows(is_bidder_index..is_bidder_index)
            values.background_color = "228B22"
          end
        end
      else

      end

      #grid.show_all
      #go_to_page(1)
    end

    send_pdf_data pdf_filename
  end



  private



  def get_chart_color(user_hash)
    color = ["28FF28","9F35FF", "FF359A", "2828FF", "EAC100", "FF5809"]
    #color = []
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
      tmp_x = 350.0 / (end_time_i - start_time_i )
      type_x = 0
      len_x = 5
      time_format = "%H:%M:%S.%L"
    else
      tmp_x = (end_time_i - start_time_i) / 350.0
      type_x = 1
      len_x = 0
      time_format = "%H:%M:%S"
    end
    return tmp_x, type_x, len_x, time_format
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

  def get_number_x(step_number, step_time, zone_time, start_datetime, start_time_i, len_x, tmp_x, base_x, type_x, time_format)
    number_x = []
    str_date = []
    str_time = []
    (1..step_number).each do |i|
      number_x[i] = if type_x == 0
                      ((start_datetime +  step_time*i).to_f - start_time_i) * tmp_x + base_x
                    else
                      ((start_datetime + step_time*i).to_f - start_time_i)/tmp_x
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
        number_y[i] = format("%.4f",number_y[i])
      end
      number_y[0] = format("%.4f", min_price)
    end
    number_y
  end
end
