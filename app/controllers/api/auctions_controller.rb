class Api::AuctionsController < Api::BaseController
  require 'time'
  before_action :set_auction, only: %i[update publish timer hold confirm]

  # GET auction info by ajax
  def obtain
    if Auction.count == 0
      render json: nil
    else
      @auction = Auction.first
      render json: @auction, status: 200
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
      AuctionHistory.where('auction_id = ? and is_bidder = true and flag is null', @auction.id).update_all(bid_time: @auction.actual_begin_time , actual_bid_time: @auction.actual_begin_time)
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
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

  # POST extend time
  def delay; end

  # POST confirm

  def confirm
    status = params[:status]
    auction_result = AuctionResult.find_by_auction_id(params[:id])
    auction_result = AuctionResult.new if auction_result.nil?
    auction_result.auction_id = params[:id].to_i
    # if status == 'void'
    #   auction_result.reserve_price = nil
    #   auction_result.lowest_average_price = nil
    #   auction_result.status = 'void'
    #   auction_result.lowest_price_bidder = nil
    #   auction_result.contract_period_start_date = nil
    #   auction_result.contract_period_end_date = nil
    #   auction_result.total_volume = nil
    #   auction_result.total_award_sum = nil
    #   auction_result.lt_peak = nil
    #   auction_result.lt_off_peak = nil
    #   auction_result.hts_peak = nil
    #   auction_result.hts_off_peak = nil
    #   auction_result.htl_peak = nil
    #   auction_result.htl_off_peak = nil
    #   auction_result.user_id = nil
    # else
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
    auction_result.user_id = params[:user_id]
    # end
    if auction_result.save
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], auction_result.to_json)
      render json: auction_result, status: 200
    else
      render json: auction_result.errors, status: 500
    end
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
