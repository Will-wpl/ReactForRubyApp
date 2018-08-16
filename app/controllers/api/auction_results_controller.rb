class Api::AuctionResultsController < Api::BaseController

  def index; end

  def award
    if params[:contract_duration].blank?
      consumptions = Consumption.get_company_user(params[:id]).where(accept_status: Consumption::AcceptStatusApproved)
    else
      consumptions = Consumption.get_company_user_by_auction_duration(params[:id],params[:contract_duration]).where(accept_status: Consumption::AcceptStatusApproved)
    end
    data = []
    consumptions.each do |consumption|

      entities = if params[:contract_duration].blank?
                   nil
                 else
                   consumption.consumption_details.select(:company_buyer_entity_id).distinct
                 end
      data.push(id: consumption.id, name: consumption.user.company_name, acknowledge: consumption.acknowledge, download_url: nil,
                auction_id: consumption.auction_id, user_id: consumption.user_id, entities: entities)
    end
    render json: data, status: 200
  end
end