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
      @auction.total_volume =0
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
    if @auction.update(publish_status: params[:publish_status])
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
    actions = [{ url: '/admin/auctions/new', name: 'Edit', icon: 'lm--icon-search', interface_type: 'auction' },
               { url: '/admin/auctions/:id', name: 'Delete', icon: 'lm--icon-search', interface_type: 'auction' }]
    data = auction.order(actual_begin_time: :asc)
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      auction = Auction.published.where(search_where_array)
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
      { name: 'Status', field_name: 'null' }
    ]
    actions = [{ url: '/admin/auctions/:id/upcoming', name: 'Edit', icon: 'lm--icon-search', interface_type: 'auction' }]
    data = auction.order(actual_begin_time: :asc)
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  # Admin create auction select retailer. If retailer's account is not approved, can't find
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      users_search_params = select_params(params, %w[company_name])
      search_where_array = set_search_params(users_search_params)
      users = User.retailers.retailer_approved.where(search_where_array)
      arrangements = Arrangement.find_by_auction_id(params[:id])
      ids = get_user_ids(arrangements)
      if !params[:status].nil? && params[:status][0] == '0'
        users = users.exclude(ids)
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
      { url: '/admin/users/:id/manage', name: 'View', icon: 'lm--icon-search' }
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
        users = users.exclude(ids)
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
        { url: '/admin/users/:id/manage', name: 'View', icon: 'lm--icon-search' }
      ]
    elsif consumer_type == '3'
      headers = [
        { name: 'Name', field_name: 'name' },
        { name: 'Housing Type', field_name: 'account_housing_type' },
        { name: 'Status', field_name: 'select_status' },
        { name: 'Action', field_name: 'select_action' }
      ]
      actions = [
        { url: '/admin/users/:id/manage', name: 'View', icon: 'lm--icon-search' }
      ]
    else
      headers = []
      actions = []
    end
    data = []
    users.order(approval_status: :desc, company_name: :asc).each do |user|
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
      Arrangement.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      #retailer_send_mails Arrangement.find_by_auction_id(auction_id).pluck(:user_id)
    elsif role_name == 'buyer'
      Consumption.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      #buyer_send_mails Consumption.find_by_auction_id(auction_id).pluck(:user_id)
    end
    render json: nil, status: 200
  end

  def retailer_dashboard

  end

  def buyer_dashboard

  end


  private

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
                                    :total_lt_peak, :total_lt_off_peak, :total_hts_peak, :total_hts_off_peak, :total_htl_peak, :total_htl_off_peak, :total_eht_peak, :total_eht_off_peak, :hold_status, :time_extension, :average_price, :retailer_mode)
  end

  def set_link(auctionId, addr)
    "/admin/auctions/#{auctionId}/#{addr}"
  end
end
