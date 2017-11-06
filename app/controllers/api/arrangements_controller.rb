class Api::ArrangementsController < ApplicationController
  before_action :set_arrangement, only: [:show, :edit, :update, :destroy]

  # GET arrangement list by auction_id
  # accept_status ['0','1','2'] '0':reject '1':accept '2':pending
  def index
    query = Arrangement.select('users.company_name ,arrangements.id , arrangements.accept_status , arrangements.auction_id , arrangements.user_id , arrangements.login_status ').joins(:user).order(:accept_status)
    if params[:accept_status] == nil
      @arrangements = query.where('auction_id': params[:auction_id])
    else
      @arrangements = query.where('auction_id = :auction_id and accept_status = :accept_status ', {auction_id: params[:auction_id], accept_status: params[:accept_status]})
    end
    render json: @arrangements, status: 200
  end

  # GET user arrangement detail info by arrangementId
  def show
    render json: @arrangement, status: 200
  end

  # PATCH update arrangement detail info
  def update
    if @arrangement.update(model_params)
      sort_auction_histories(@arrangement.auction_id , @arrangement.user_id)
      render json: @arrangement ,status: 200
    else
      render json: 'error code ', status: 500
    end
  end

  private

  def set_arrangement
    @arrangement = Arrangement.find(params[:id])
  end

  def model_params
    params.require(:arrangement).permit(:main_name, :main_email_address, :main_mobile_number, :main_office_number, :alternative_name, :alternative_email_address, :alternative_mobile_number, :alternative_office_number, :lt_peak, :lt_off_peak, :hts_peak, :hts_off_peak, :htl_peak, :htl_off_peak, :accept_status)
  end

end
