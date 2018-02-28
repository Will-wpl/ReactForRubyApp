class Api::AuctionsController < Api::BaseController
  before_action :set_auction, only: %i[timer]

  # GET auction info by ajax
  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      render json: auction, status: 200
    end
  end

  # PATCH update auction by ajax
  def update
    if params[:id] == '0' # create
      @auction.publish_status = '0'
      @auction.total_lt_peak = 0
      @auction.total_lt_off_peak = 0
      @auction.total_hts_peak = 0
      @auction.total_hts_off_peak = 0
      @auction.total_htl_peak = 0
      @auction.total_htl_off_peak = 0
      @auction.total_eht_peak = 0
      @auction.total_eht_off_peak = 0
      @auction.total_volume = 0
      if @auction.save
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: @auction, status: 201
      end
    else # update
      # params[:auction]['total_volume'] = Auction.set_total_volume(model_params[:total_lt_peak], model_params[:total_lt_off_peak], model_params[:total_hts_peak], model_params[:total_hts_off_peak], model_params[:total_htl_peak], model_params[:total_htl_off_peak])
      if @auction.update(model_params)
        AuctionHistory.where('auction_id = ? and is_bidder = true and flag is null', @auction.id).update_all(bid_time: @auction.actual_begin_time, actual_bid_time: @auction.actual_begin_time)

        # set sorted histories to redis
        histories = AuctionHistory.where('auction_id = ? and is_bidder = true and flag is null', @auction.id)
        RedisHelper.set_current_sorted_histories(@auction.id, histories)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
      end
      render json: @auction, status: 200
    end
  end

  def destroy
    if @auction.publish_status == '0'
      @auction.destroy
      render json: nil, status: 200
    else
      render json: { message: 'The auction already published, you can not delete it!' }, status: 200
    end
  end

  # PUT publish auction by ajax
  def publish
    exist_published_gid = @auction.published_gid
    published_gid = if exist_published_gid.nil? || exist_published_gid == ''
                      "RA#{Time.current.year}" + (Auction.published.current_year.count + 1).to_s.rjust(4, '0')
                    else
                      exist_published_gid
                    end

    if @auction.update(publish_status: params[:publish_status], published_gid: published_gid)
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
    end
    render json: @auction, status: 200
  end

  # POST hold auction for long pulling
  def hold
    hold_status = params[:hold_status] == 'true'
    # click hold
    if hold_status
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: true, forward: false }, status: 200
      end
    elsif !hold_status && Time.current < @auction.actual_begin_time
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: false, forward: false }, status: 200
      end
    elsif !hold_status && Time.current > @auction.actual_begin_time
      if @auction.update(hold_status: hold_status, actual_begin_time: Time.current, actual_end_time: Time.current + 60 * @auction.duration)
        # link = set_link(@auction.id, 'dashboard')
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: false, forward: true }, status: 200
      end
    end
  end

  # GET current time by ajax
  def timer
    render json: { current_time: Time.current, hold_status: @auction.hold_status, actual_begin_time: @auction.actual_begin_time, actual_end_time: @auction.actual_end_time }, status: 200
  end

  # POST confirm
  def confirm
    status = params[:status]
    auction_result = AuctionResult.find_by_auction_id(params[:id])
    auction_result = AuctionResult.new if auction_result.nil?
    auction_result.auction_id = params[:id].to_i
    history = AuctionHistory.select('auction_histories.* ,users.company_name').joins(:user).where('auction_id = ? and user_id = ? and is_bidder = true ', params[:id], params[:user_id]).order(actual_bid_time: :desc).first
    auction_result.reserve_price = @auction.reserve_price
    auction_result.lowest_average_price = history.average_price
    auction_result.status = status
    auction_result.lowest_price_bidder = history.company_name
    auction_result.contract_period_start_date = @auction.contract_period_start_date
    auction_result.contract_period_end_date = @auction.contract_period_end_date
    auction_result.total_volume = @auction.total_volume
    auction_result.total_award_sum = history.total_award_sum
    auction_result.lt_peak = history.lt_peak
    auction_result.lt_off_peak = history.lt_off_peak
    auction_result.hts_peak = history.hts_peak
    auction_result.hts_off_peak = history.hts_off_peak
    auction_result.htl_peak = history.htl_peak
    auction_result.htl_off_peak = history.htl_off_peak
    auction_result.eht_peak = history.eht_peak
    auction_result.eht_off_peak = history.eht_off_peak
    auction_result.user_id = params[:user_id]
    auction_result.justification = params[:justification]
    # end
    if auction_result.save
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], auction_result.to_json)
    end
    render json: auction_result, status: 200
  end

  def unpublished
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      auction = Auction.unpublished.where(search_where_array)
                       .page(params[:page_index]).per(params[:page_size])
      total = auction.total_count
    else
      auction = Auction.unpublished
      total = auction.count
    end
    headers = [
      { name: 'Name', field_name: 'name' },
      { name: 'Date/Time', field_name: 'actual_begin_time' }
    ]
    actions = [
      { url: '/admin/auctions/:id/buyer_dashboard?unpublished', name: 'Buyer Dashboard', icon: 'view', interface_type: 'auction' },
      { url: '/admin/auctions/new', name: 'Manage', icon: 'manage', interface_type: 'auction' },
      { url: '/admin/auctions/:id', name: 'Delete', icon: 'delete', interface_type: 'auction' }]
    data = auction.order(actual_begin_time: :asc)
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      auction = Auction.published.has_auction_result.where(search_where_array)
                       .page(params[:page_index]).per(params[:page_size])
      total = auction.total_count
    else
      auction = Auction.published
      total = auction.count
    end
    headers = [
      { name: 'ID', field_name: 'published_gid' },
      { name: 'Name', field_name: 'name' },
      { name: 'Date/Time', field_name: 'actual_begin_time' },
      { name: 'Status', field_name: 'status' }
    ]
    actions = [
      { url: '/admin/auctions/:id/retailer_dashboard', name: 'Retailer Dashboard', icon: 'edit', interface_type: 'auction' },
      { url: '/admin/auctions/:id/buyer_dashboard?published', name: 'Buyer Dashboard', icon: 'view', interface_type: 'auction' },
      { url: '/admin/auctions/:id/upcoming', name: 'Manage', icon: 'manage', interface_type: 'auction' },
      { url: '/admin/auctions/:id/online', name: 'Commence', icon: 'bidding', interface_type: 'auction' }
    ]
    data = []
    auction.order(actual_begin_time: :asc).each do |auction|
      status = if Time.current < auction.actual_begin_time
                 'Upcoming'
               # elsif Time.current >= auction.actual_begin_time && Time.current <= auction.actual_end_time
               else
                 'In Progress'
               end
      data.push(id: auction.id, published_gid: auction.published_gid, name: auction.name, actual_begin_time: auction.actual_begin_time, status: status)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  # Admin create auction select retailer. If retailer's account is not approved, can't find
  # params[:status]: "0", "Not Invited", "1":"Invited", "2":"Pending Notification",  "3":"Notification Sent"
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      users_search_params = select_params(params, %w[company_name])
      search_where_array = set_search_params(users_search_params)
      users = User.retailers.retailer_approved.where(search_where_array)
      arrangements = Arrangement.find_by_auction_id(params[:id])
      ids = get_user_ids(arrangements)
      if !params[:status].nil? && params[:status][0] == '0'
        users = users.exclude(ids) unless ids.empty?
      elsif !params[:status].nil? && params[:status][0] == '1'
        users = users.selected_retailers(params[:id])
      elsif !params[:status].nil? && (params[:status][0] == '2' || params[:status][0] == '3')
        action_status = params[:status][0] == '2' ? '2' : '1'
        users = users.selected_retailers_action_status(params[:id], action_status)
      end

      users = users.page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.retailers
      total = users.count
    end
    headers = [
      { name: 'Company Name', field_name: 'company_name' },
      { name: 'Status', field_name: 'select_status' },
      { name: 'Action', field_name: 'select_action' }
    ]
    actions = [
      { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
    ]
    data = []
    users.order(company_name: :asc).each do |user|
      index = arrangements.index do |arrangement|
        arrangement.user_id == user.id
      end
      arrangement = index.nil? ? nil : arrangements[index]
      status = arrangement.nil? ? nil : arrangement.action_status
      action = arrangement.nil? ? nil : arrangement.id
      data.push(user_id: user.id, company_name: user.company_name, select_status: status, select_action: action)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def buyers
    if params.key?(:page_size) && params.key?(:page_index)
      consumer_type = params[:consumer_type][0]
      users_search_params = if consumer_type == '2'
                              select_params(params, %w[company_name consumer_type])
                            elsif consumer_type == '3'
                              select_params(params, %w[name consumer_type account_housing_type])
                            else
                              []
                            end
      search_where_array = set_search_params(users_search_params)
      users = User.buyers.where(search_where_array)
      consumptions = Consumption.find_by_auction_id(params[:id])
      ids = get_user_ids(consumptions)

      if !params[:status].nil? && params[:status][0] == '0'
        users = users.exclude(ids) unless ids.empty?
      elsif !params[:status].nil? && params[:status][0] == '1'
        users = users.selected_buyers(params[:id])
      elsif !params[:status].nil? && (params[:status][0] == '2' || params[:status][0] == '3')
        action_status = params[:status][0] == '2' ? '2' : '1'
        users = users.selected_buyers_action_status(params[:id], action_status)
      end

      users = users.page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.buyers
      total = users.count
    end
    if consumer_type == '2'
      headers = [
        { name: 'Company Name', field_name: 'company_name' },
        { name: 'Status', field_name: 'select_status' },
        { name: 'Action', field_name: 'select_action' }
      ]
      actions = [
        { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
      ]
      users = users.order(company_name: :asc)
    elsif consumer_type == '3'
      headers = [
        { name: 'Name', field_name: 'name' },
        { name: 'Housing Type', field_name: 'account_housing_type' },
        { name: 'Status', field_name: 'select_status' },
        { name: 'Action', field_name: 'select_action' }
      ]
      actions = [
        { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
      ]
      users = users.order(name: :asc)
    else
      headers = []
      actions = []
    end
    data = []
    users.each do |user|
      # status = ids.include?(user.id) ? '1' : '0'
      index = consumptions.index do |consumption|
        consumption.user_id == user.id
      end
      consumption = index.nil? ? nil : consumptions[index]
      status = consumption.nil? ? nil : consumption.action_status
      action = consumption.nil? ? nil : consumption.id
      if consumer_type == '2'
        data.push(user_id: user.id, company_name: user.company_name, select_status: status, select_action: action)
      elsif consumer_type == '3'
        data.push(user_id: user.id, name: user.name, account_housing_type: user.account_housing_type, select_status: status, select_action: action)
      end
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def selects
    retailers = Arrangement.find_by_auction_id(params[:id]).group(:action_status).count
    company_buyers = Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('2').group(:action_status).count
    individual_buyers = Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('3').group(:action_status).count

    render json: { retailers: retailers, company_buyers: company_buyers, individual_buyers: individual_buyers }, status: 200
  end

  def send_mails
    auction_id = params[:id]
    role_name = params[:role_name]
    if role_name == 'retailer'
      user_ids = Arrangement.find_by_auction_id(auction_id).is_not_notify.pluck(:user_id)
      Arrangement.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      retailer_send_mails user_ids
    elsif role_name == 'buyer'
      user_ids = Consumption.find_by_auction_id(auction_id).is_not_notify.pluck(:user_id)
      Consumption.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      buyer_send_mails user_ids
    end
    render json: nil, status: 200
  end

  def retailer_dashboard
    tenders = TenderWorkflow.new.get_action_state_machine(params[:id])
    render json: tenders, status: 200
  end

  def buyer_dashboard
    consumptions_company = []
    Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('2').order(:participation_status).each do |consumption|
      consumptions_company.push(id: consumption.id, name: consumption.user.company_name, participation_status: consumption.participation_status)
    end
    count_company = consumptions_company.count

    consumptions_individual = []
    Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('3').order(:participation_status).each do |consumption|
      consumptions_individual.push(id: consumption.id, name: consumption.user.name, participation_status: consumption.participation_status)
    end
    count_individual = consumptions_individual.count
    render json: { consumptions_company: consumptions_company, count_company: count_company, consumptions_individual: consumptions_individual, count_individual:count_individual }, status: 200
  end

  def pdf
    zone_time = pdf_datetime_zone
    start_time = params[:start_time]
    end_time = params[:end_time]
    start_time2 = params[:start_time2]
    end_time2 = params[:end_time2]
    start_price = params[:start_price]
    end_price = params[:end_price]

    end_time['Z'] = '.999Z'
    end_time2['Z'] = '.999Z'

    auction_id = params[:id]
    img = Rails.root.join("app","assets", "pdf","bk.png")
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

    # select
    auction_result = AuctionResult.find_by_auction_id(auction_id)
    auction = Auction.find(auction_id)
    histories_achieved = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc, actual_bid_time asc ', auction_id]
    achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?

    histories = AuctionHistory.select('users.id, users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and bid_time BETWEEN ? AND ?', auction_id, start_time, end_time).order(bid_time: :asc)
    histories_2 = AuctionHistory.select('users.id, users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and bid_time BETWEEN ? AND ?', auction_id, start_time2, end_time2).order(bid_time: :asc)
    #
    hash, user_company_name_hash = get_histories_hash(histories)
    hash2, user_company_name_hash2 = get_histories_hash(histories_2)
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
    (0..user_company_name_hash2.keys().size).each do |i|
      number_y2[i] = i.to_s
    end
    ##### chart 2 end #####
    chart_color = get_chart_color(hash)
    ######
    pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => img,
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

          (1..user_company_name_hash2.keys().size).each do |i|
            horizontal_line number_x2[0], number_x2[0] + 5, :at => 20 + (200.0/user_company_name_hash2.keys().size) * i
            font_size(9) { text_box number_y2[i], :at => [base_x-60, 20 + (200/user_company_name_hash2.keys().size)*i + 3],:width => 55,:height => 10, :align => :right}
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
              data_y = 20 + (200.0/user_company_name_hash2.keys().size) * item.ranking
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
      if !auction_result.nil?
        if !auction_result.status.nil?
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

        visibility_lt =  auction.total_lt_peak > 0 || auction.total_lt_off_peak > 0
        visibility_hts = auction.total_hts_peak > 0 || auction.total_hts_off_peak > 0
        visibility_htl = auction.total_htl_peak > 0 || auction.total_htl_off_peak > 0
        visibility_eht = auction.total_eht_peak > 0 || auction.total_eht_off_peak > 0

        table0_head, table0_row1, table0_row2 = [""], ["Peak (7am-7pm)"], ["Off-Peak (7pm-7am)"]

        if visibility_lt
          table0_head.push('<b>LT</b>')
          table0_row1.push('$ ' + format("%.4f", auction_result.lt_peak))
          table0_row2.push('$ ' + format("%.4f", auction_result.lt_off_peak))
        else
          table0_head.push('')
          table0_row1.push('')
          table0_row2.push('')
        end

        if visibility_hts
          table0_head.push('<b>HT (Small)</b>')
          table0_row1.push('$ ' + format("%.4f", auction_result.hts_peak))
          table0_row2.push('$ ' + format("%.4f", auction_result.hts_off_peak))
        else
          table0_head.push('')
          table0_row1.push('')
          table0_row2.push('')
        end

        if visibility_htl
          table0_head.push('<b>HT (Large)</b>')
          table0_row1.push('$ ' + format("%.4f", auction_result.htl_peak))
          table0_row2.push('$ ' + format("%.4f", auction_result.htl_off_peak))
        else
          table0_head.push('')
          table0_row1.push('')
          table0_row2.push('')
        end

        if visibility_eht
          table0_head.push('<b>EHT (Large)</b>')
          table0_row1.push('$ ' + format("%.4f", auction_result.eht_peak))
          table0_row2.push('$ ' + format("%.4f", auction_result.eht_off_peak))
        else
          table0_head.push('')
          table0_row1.push('')
          table0_row2.push('')
        end

        #'D MMM YYYY'
        contract_period_start_date = (auction.contract_period_start_date).strftime("%d %b %Y")
        contract_period_end_date = (auction.contract_period_end_date).strftime("%d %b %Y")


        data0 = [ ["<font size='18'><color rgb='#{status_color}'>Status: #{status}</color></font>"],
                  ["Summary Of Lowest Bidder"],
                  ["Lowest Price Bidder:#{lowest_price_bidder}"],
                  ["Lowest Average Price:$ #{lowest_average_price}/kWh"] ]
        table0 = [ table0_head,
                   table0_row1,
                   table0_row2 ]

        total_volume = ActiveSupport::NumberHelper.number_to_currency(auction.total_volume.round, precision: 0, unit: '')
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
          table(table0, :header => true, :cell_style => {:size => 9, :align => :center, :padding => [11,2], :inline_format => true, :width => bounds.right/table0_head.size, :border_width => 0.01,:border_color => "424242"}) do
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

    now_time = Time.new.strftime("%Y%m%d%H%M%S")
    send_data IO.read(Rails.root.join(pdf_filename)), :filename => "report-#{now_time}.pdf"
    File.delete Rails.root.join(pdf_filename)
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

  def pdf_datetime_zone
    zone = 8
    (zone * 60 * 60)
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

  def get_histories_hash(histories)
    hash = {}
    user_company_name_hash = {}
    histories.each {|history|
      user_company_name_hash[history.user_id] = (history.company_name) unless user_company_name_hash.has_key?(history.user_id)
      hash[history.user_id] = [] unless hash.has_key?(history.user_id)
      hash[history.user_id].push(history)
    }
    return hash, user_company_name_hash
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
    return number_y
  end

  def retailer_send_mails(user_ids)
    return if user_ids.empty?
    User.where('id in (?)', user_ids).each do |user|
      UserMailer.retailer_invited_email(user).deliver_later
    end
  end

  def buyer_send_mails(user_ids)
    return if user_ids.empty?
    User.where('id in (?)', user_ids).each do |user|
      UserMailer.buyer_invited_email(user).deliver_later
    end
  end

  def set_auction
    @auction = params[:id] == '0' ? Auction.new(model_params) : Auction.find(params[:id])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price, :actual_begin_time, :actual_end_time, :total_volume, :publish_status, :published_gid,
                                    :total_lt_peak, :total_lt_off_peak, :total_hts_peak, :total_hts_off_peak, :total_htl_peak, :total_htl_off_peak, :total_eht_peak, :total_eht_off_peak, :hold_status, :time_extension, :average_price, :retailer_mode, :starting_price)
  end

  def set_link(auctionId, addr)
    "/admin/auctions/#{auctionId}/#{addr}"
  end
end
