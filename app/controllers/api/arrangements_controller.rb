class Api::ArrangementsController < Api::BaseController
  before_action :set_arrangement, only: %i[show edit update destroy update_status]

  # GET arrangement list by auction_id
  # accept_status ['0','1','2'] '0':reject '1':accept '2':pending
  def index
    @arrangements = Arrangement.query_list(params[:auction_id], params[:accept_status])
    render json: @arrangements, status: 200
  end

  # GET user arrangement detail info by arrangementId
  def show
    render json: @arrangement, status: 200
  end

  def obtain
    @arrangement = Arrangement.auction_of_current_user(params[:auction_id], current_user.id).first
    render json: @arrangement, status: 200
  end

  # PATCH update arrangement detail info
  def update
    # auction = Auction.find(@arrangement.auction_id)
    # if auction.actual_begin_time < Time.current
    #   render json: {message: 'invalid time'}, status: 200
    # else
    if @arrangement.update(model_params)
      calculate_dto = CalculateDto.new(@arrangement)

      AuctionHistory.save_update_sort_init_auction_histories(calculate_dto)
      AuctionEvent.set_events(current_user.id, @arrangement.auction_id, request[:action], @arrangement.to_json)
    end
    render json: @arrangement, status: 200
  end

  def update_status
    if params[:id] == '0'
      if Arrangement.find_by_auction_and_user(params[:auction_id], params[:user_id]).exists?
        @arrangement = Arrangement.new
        @arrangement.auction_id = params[:auction_id]
        @arrangement.user_id = params[:user_id]
        @arrangement.action_status = '2'
        @arrangement.main_name = ''
        @arrangement.main_email_address = ''
        @arrangement.main_mobile_number = ''
        @arrangement.main_office_number = ''
        @arrangement.save
        render json: @arrangement, status: 201
      else
        render json: { message: 'consumption exist' }, status: 200
      end

    else
      @arrangement.update(action_status: params['action_status'])
      render json: @arrangement, status: 200
    end
  end

  def destroy
    @arrangement.destroy
    render json: nil, status: 200
  end

  private

  def set_arrangement
    @arrangement = Arrangement.find(params[:id]) unless params[:id] == '0'
  end

  def model_params
    params.require(:arrangement).permit(:main_name, :main_email_address, :main_mobile_number, :main_office_number, :alternative_name, :alternative_email_address, :alternative_mobile_number, :alternative_office_number, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak, :eht_peak, :eht_off_peak, :accept_status)
  end
end
