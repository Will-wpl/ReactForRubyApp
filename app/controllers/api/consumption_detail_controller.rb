class Api::ConsumptionDetailController < Api::BaseController

  def update

  end

  private

  def set_auction
    @consumption_detail = params[:id] == '0' ? ConsumptionDetail.new(model_params) : ConsumptionDetail.find(params[:id])
  end

  def model_params
    params.require(:consumption_detail).permit(:account_number, :intake_level, :peak, :off_peak, :comsumption_id)
  end
end
