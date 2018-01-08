class Api::ConsumptionsController < Api::BaseController
  before_action :set_consumption, only: %i[update_status destroy]

  def update_status
    if params[:id] == '0'
      @consumption = Consumption.new
      @consumption.auction_id = params[:auction_id]
      @consumption.user_id = params[:user_id]
      @consumption.action_status = '2'
      @consumption.participation_status = '2'
      @consumption.save
      render json: @consumption, status: 201
    else
      @consumption.update(action_status: params['action_status'])
      render json: @consumption, status: 200
    end
  end

  def destroy
    @consumption.destroy
    render json: nil, status: 200
  end

  private

  def set_consumption
    @consumption = Consumption.find(params[:id]) unless params[:id] == '0'
  end
end
