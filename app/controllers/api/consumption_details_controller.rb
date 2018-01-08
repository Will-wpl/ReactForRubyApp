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

  def participate
    params[:details].each do |detail|
      consumption_detail = ConsumptionDetail.new
      consumption_detail.account_number = detail[:account_number]
      consumption_detail.intake_level = detail[:intake_level]
      consumption_detail.peak = detail[:peak]
      consumption_detail.off_peak = detail[:off_peak]
      consumption_detail.consumption_id = params[:consumption_id]
      consumption_detail.save
    end
    consumption = Consumption.find(params[:consumption_id])
    consumption.participation_status = '1'
    consumption.save
    render json: consumption, status: 200
  end

  def reject
    consumption = Consumption.find(params[:consumption_id])
    consumption.participation_status = '0'
    consumption.save
    render json: consumption, status: 200
  end

  private

  def set_consumption_detail
    @detail = params[:id] == '0' ? ConsumptionDetail.new(model_params) : ConsumptionDetail.find(params[:id])
  end

  def model_params
    params.require(:consumption_detail).permit(:account_number, :intake_level, :peak, :off_peak, :consumption_id)
  end
end
