class Api::ConsumptionDetailsController < Api::BaseController

  def index
    unless params[:consumption_id].nil?
      @consumption_details = ConsumptionDetail.where('consumption_id = ?', params[:consumption_id])
      render json: @consumption_details, status: 200
    end
  end

  def update
    if params[:id] == '0' # create
      render json: @detail, status: 201 if @detail.save
    else # update
      render json: @detail, status: 200 if @detail.update(model_params)
    end
  end

  private

  def set_consumption_detail
    @detail = params[:id] == '0' ? ConsumptionDetail.new(model_params) : ConsumptionDetail.find(params[:id])
  end

  def model_params
    params.require(:consumption_detail).permit(:account_number, :intake_level, :peak, :off_peak, :consumption_id)
  end
end
