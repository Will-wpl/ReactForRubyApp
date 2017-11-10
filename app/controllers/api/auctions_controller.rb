class Api::AuctionsController < Api::BaseController
  before_action :set_auction, only: [:update, :publish, :timer, :hold, :confrim]

  # GET auction info by ajax
  def obtain
    if Auction.count == 0
      render json: nil
    else
      @auction = Auction.first
      render json: @auction, status: 200
    end
  end

  # GET manage route link by ajax
  def link
    @auction = Auction.first
    if @auction.publish_status != '1'
      render json: {url: '/admin/auctions/empty'}, status: 200
    elsif @auction.publish_status == '1' && Time.now < @auction.actual_begin_time
      link = set_link(@auction.id, 'upcoming')
      render json: {url: link}, status: 200
    elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.now && Time.now < @auction.actual_end_time
      link = set_link(@auction.id, 'dashboard')
      render json: {url: link}, status: 200
    elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.now
      link = set_link(@auction.id, 'result')
      render json: {url: link}, status: 200
    else
      render json: nil, status: 200
    end
  end

  # POST create auction by ajax
  def create
    @auction = Auction.new(model_params)
    if @auction.save
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
      render json: @auction, status: 201
    else
      render json: 'error code ', status: 500
    end
  end

  # PATCH update auction by ajax
  def update
    params[:auction]['total_volume'] = Auction.set_total_volume(model_params[:total_lt_peak], model_params[:total_lt_off_peak], model_params[:total_hts_peak], model_params[:total_hts_off_peak], model_params[:total_htl_peak], model_params[:total_htl_off_peak])
    if @auction.update(model_params)
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
      # $redis.sadd(@auction.id , @auction.to_json)
      # $redis.set(@auction.id, @auction.to_json)
      render json: @auction, status: 200
    else
      render json: 'error code ', status: 500
    end
  end

  # PUT publish auction by ajax
  def publish
    if @auction.update(publish_status: params[:publish_status])
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
      render json: @auction, status: 200
    else
      render json: 'error code ', status: 500
    end
  end

  # POST hold auction for long pulling
  def hold
    hold_status = params[:hold_status] == "true" ? true : false
    # click hold
    if hold_status
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: {hold_status: true, forward: false}, status: 200
      end
    elsif !hold_status && Time.now < @auction.actual_begin_time
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: {hold_status: false, forward: false}, status: 200
      end
    elsif !hold_status && Time.now > @auction.actual_begin_time
      if @auction.update(hold_status: hold_status, actual_begin_time: Time.now, actual_end_time: Time.now + 60 * @auction.duration)
        # link = set_link(@auction.id, 'dashboard')
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: {hold_status: false, forward: true}, status: 200
      end
    end
  end

  # GET current time by ajax
  def timer
    render json: {current_time: Time.now, hold_status: @auction.hold_status, actual_begin_time: @auction.actual_begin_time, actual_end_time: @auction.actual_end_time}, status: 200
  end

  # POST extend time
  def delay

  end

  # POST confirm
  def confirm
    status = params[:status]
    result = AuctionResult.new
    if status == 'void'
      result.auction_id = params[:id]
      result.status = 'void'
    else
      history = AuctionHistory.where('auction_id = ? and user_id = ? and is_bidder = true ', params[:id], params[:user_id]).order(bid_time: :desc).first
      user = User.find(params[:user_id])
      result.reserve_price = @auction.reserve_price
      result.lowest_average_price = history.average_price
      result.status = 'winner'
      result.lowest_price_bidder = user.company_name
      result.contract_period_start_date = @auction.contract_period_start_date
      result.contract_period_end_date = @auction.contract_period_end_date
      result.total_volume = @auction.total_volume
      result.total_award_sum = history.total_award_sum
      result.lt_peak = history.lt_peak
      result.lt_off_peak = history.lt_off_peak
      result.hts_peak = history.hts_peak
      result.hts_off_peak = history.hts_off_peak
      result.htl_peak = history.htl_peak
      result.htl_off_peak = history.htl_off_peak
      result.user_id = params[:user_id]

      if result.save
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], result.to_json)
        render json: result
      end

    end


    AuctionResult

  end

  # set logout status
  def logout
    user = User.find(params[:user_id])
    UserExtension.save_or_update_login_status(user, 'logout', params[:id], request[:action])
  end

  private

  def set_auction
    @auction = Auction.find(params[:id])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price, :actual_begin_time, :actual_end_time, :total_volume, :publish_status, :published_gid,
                                    :total_lt_peak, :total_lt_off_peak, :total_hts_peak, :total_hts_off_peak, :total_htl_peak, :total_htl_off_peak, :hold_status)
  end

  def set_link(auctionId, addr)
    "/admin/auctions/#{auctionId}/#{addr}"
  end


end
