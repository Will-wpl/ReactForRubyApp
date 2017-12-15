class Api::ArrangementsController < Api::BaseController
  before_action :set_arrangement, only: %i[show edit update destroy]

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
      calculate_dto = CalculateDto.new(@arrangement)

      AuctionHistory.save_update_sort_init_auction_histories(calculate_dto)
      AuctionEvent.set_events(current_user.id, @arrangement.auction_id, request[:action], @arrangement.to_json)
    end
    render json: @arrangement, status: 200
  end

  private

  def set_arrangement
      @arrangement = Arrangement.find(params[:id])
  end

  def model_params
    params.require(:arrangement).permit(:main_name, :main_email_address, :main_mobile_number, :main_office_number, :alternative_name, :alternative_email_address, :alternative_mobile_number, :alternative_office_number, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak, :accept_status)
  end

end
