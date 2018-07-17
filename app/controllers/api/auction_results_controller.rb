class Api::AuctionResultsController < Api::BaseController

  def index; end

  def award
    if params[:contract_duration].blank?
      consumptions = Consumption.get_company_user(params[:id])
    else
      consumptions = Consumption.get_company_user_by_auction_duration(params[:id],params[:contract_duration])
    end
    data = []
    consumptions.each do |consumption|
      data.push(id: consumption.id, name: consumption.user.company_name, acknowledge: consumption.acknowledge, download_url: nil,
                auction_id: consumption.auction_id, user_id: consumption.user_id)
    end
    render json: data, status: 200
  end
end