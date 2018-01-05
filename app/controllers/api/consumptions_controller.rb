class Api::ConsumptionsController < Api::BaseController
  before_action :set_consumption, only: %i[destroy]

  def create
    @consumption = Consumption.new
    @consumption.auction_id = params[:auction_id]
    @consumption.user_id = params[:user_id]
    @consumption.action_status = '2'
    @consumption.participation_status = '2'
    @consumption.save
    render json: @consumption, status: 201
  end

  def destroy
    @consumption.destroy
    render json: nil, status: 200
  end

  private

  def set_consumption
    @consumption = Consumption.find(params[:id])
  end
end
