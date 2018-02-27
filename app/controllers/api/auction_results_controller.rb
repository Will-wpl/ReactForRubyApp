class Api::AuctionResultsController < Api::BaseController

  def index; end

  def award
    consumptions = Consumption.get_company_user(params[:id])
    data = []
    consumptions.each do |consumption|
      data.push(id: consumption.id, name: consumption.user.company_name, acknowledge: consumption.acknowledge, download_url: nil)
    end
    render json: data, status: 200
  end
end