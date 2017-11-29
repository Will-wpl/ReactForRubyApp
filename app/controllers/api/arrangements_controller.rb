class Api::ArrangementsController < Api::BaseController
  before_action :set_arrangement, only: %i[show edit update destroy]

  # GET arrangement list by auction_id
  # accept_status ['0','1','2'] '0':reject '1':accept '2':pending
  def index
    query = Arrangement.select('arrangements.*, users.company_name , user_extensions.login_status , user_extensions.current_room , user_extensions.current_page').left_outer_joins(user: :user_extension).order('arrangements.accept_status ASC, users.company_name ASC')
    if params[:accept_status].nil?
      @arrangements = query.where('auction_id': params[:auction_id])
    else
      @arrangements = query.where('auction_id = :auction_id and accept_status = :accept_status ', auction_id: params[:auction_id], accept_status: params[:accept_status])
    end
    unless is_admin
      @arrangements = query.where('user_id': current_user.id)
    end
    render json: @arrangements, status: 200
  end

  # GET user arrangement detail info by arrangementId
  def show
    render json: @arrangement, status: 200
  end

  def obtain
    @arrangement = Arrangement.where('auction_id = ? and user_id = ?', params[:auction_id], current_user.id).first
    render json: @arrangement, status: 200
  end

  # PATCH update arrangement detail info
  def update
    # auction = Auction.find(@arrangement.auction_id)
    # if auction.actual_begin_time < Time.current
    #   render json: {message: 'invalid time'}, status: 200
    # else
    if @arrangement.update(model_params)
      # calculate_dto = CalculateDto.new(@arrangement.lt_peak ,@arrangement.lt_off_peak,@arrangement.hts_peak,@arrangement.hts_off_peak, @arrangement.htl_peak, @arrangement.htl_off_peak, @arrangement.auction_id, @arrangement.user_id)
      calculate_dto = CalculateDto.new
      calculate_dto.lt_peak = @arrangement.lt_peak
      calculate_dto.lt_off_peak = @arrangement.lt_off_peak
      calculate_dto.hts_peak = @arrangement.hts_peak
      calculate_dto.hts_off_peak = @arrangement.hts_off_peak
      calculate_dto.htl_peak = @arrangement.htl_peak
      calculate_dto.htl_off_peak = @arrangement.htl_off_peak
      calculate_dto.user_id = @arrangement.user_id
      calculate_dto.auction_id = @arrangement.auction_id

      AuctionHistory.save_update_sort_init_auction_histories(calculate_dto)
      AuctionEvent.set_events(current_user.id, @arrangement.auction_id, request[:action], @arrangement.to_json)
      render json: @arrangement, status: 200
    else
      render json: 'error code ', status: 500
    end
    # end
  end

  private

  def set_arrangement
      @arrangement = Arrangement.find(params[:id])
  end

  def model_params
    params.require(:arrangement).permit(:main_name, :main_email_address, :main_mobile_number, :main_office_number, :alternative_name, :alternative_email_address, :alternative_mobile_number, :alternative_office_number, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak, :accept_status)
  end
end
