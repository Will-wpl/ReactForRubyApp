class Api::ConsumptionDetailsController < Api::BaseController

  def index
    unless params[:consumption_id].nil?
      @consumption_details = ConsumptionDetail.where('consumption_id = ?', params[:consumption_id])
      render json: @consumption_details, status: 200
    end
  end

  def update
    if params[:id] == '0' # create
      render json: @consumption_detail, status: 201 if @consumption_detail.save
    else # update
      render json: @consumption_detail, status: 200 if @consumption_detail.update(model_params)
    end
  end

  private

  def set_consumption_detail
    @consumption_detail = params[:id] == '0' ? ConsumptionDetail.new(model_params) : ConsumptionDetail.find(params[:id])
  end

  def model_params
    params.require(:consumption_detail).permit(:account_number, :intake_level, :peak, :off_peak, :comsumption_id)
  end
end
