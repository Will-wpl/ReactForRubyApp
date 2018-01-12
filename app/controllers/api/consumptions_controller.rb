class Api::ConsumptionsController < Api::BaseController
  before_action :set_consumption, only: %i[update_status destroy]

  def index
    consumptions = Consumption.find_by_user_consumer_type(params[:consumer_type]).find_by_auction_id(params[:id])
    data = []
    total_info = { consumption_count: 0, account_count: 0, lt_peak: 0, lt_off_peak: 0,
                   hts_peak: 0, hts_off_peak: 0, htl_peak: 0, htl_off_peak: 0, eht_peak: 0, eht_off_peak: 0 }
    consumptions.each do |consumption|
      count = ConsumptionDetail.find_by_consumption_id(consumption.id).count
      data.push(id: consumption.id,
                auction_id: consumption.auction_id,
                user_id: consumption.user_id,
                company_name: consumption.user.company_name,
                name: consumption.user.name,
                count: count,
                lt_peak: consumption.lt_peak.nil? ? 0 : consumption.lt_peak,
                lt_off_peak: consumption.lt_off_peak.nil? ? 0 : consumption.lt_off_peak,
                hts_peak: consumption.hts_peak.nil? ? 0 : consumption.hts_peak,
                hts_off_peak: consumption.hts_off_peak.nil? ? 0 : consumption.hts_off_peak,
                htl_peak: consumption.htl_peak.nil? ? 0 : consumption.htl_peak,
                htl_off_peak: consumption.htl_off_peak.nil? ? 0 : consumption.htl_off_peak,
                eht_peak: consumption.eht_peak.nil? ? 0 : consumption.eht_peak,
                eht_off_peak: consumption.eht_off_peak.nil? ? 0 : consumption.eht_off_peak,
                details: consumption.consumption_details)
      total_info[:consumption_count] += 1
      total_info[:account_count] += count
      total_info[:lt_peak] += consumption.lt_peak.nil? ? 0 : consumption.lt_peak
      total_info[:lt_off_peak] += consumption.lt_off_peak.nil? ? 0 : consumption.lt_off_peak
      total_info[:hts_peak] += consumption.hts_peak.nil? ? 0 : consumption.hts_peak
      total_info[:hts_off_peak] += consumption.hts_off_peak.nil? ? 0 : consumption.hts_off_peak
      total_info[:htl_peak] += consumption.htl_peak.nil? ? 0 : consumption.htl_peak
      total_info[:htl_off_peak] += consumption.htl_off_peak.nil? ? 0 : consumption.htl_off_peak
      total_info[:eht_peak] += consumption.eht_peak.nil? ? 0 : consumption.eht_peak
      total_info[:eht_off_peak] += consumption.eht_off_peak.nil? ? 0 : consumption.eht_off_peak
    end
    render json: { list: data, total_info: total_info }, status: 200
  end

  def update_status
    if params[:id] == '0'
      if Consumption.find_by_auction_and_user(params[:auction_id], params[:user_id]).exists?
        render json: { message: 'consumption exist' }, status: 200
      else
        @consumption = Consumption.new
        @consumption.auction_id = params[:auction_id]
        @consumption.user_id = params[:user_id]
        @consumption.action_status = '2'
        @consumption.participation_status = '2'
        @consumption.save
        render json: @consumption, status: 201
      end
    else
      if params['action_status'] == '1'
      @consumption.update(action_status: params['action_status'])
      render json: @consumption, status: 200
      else
        @consumption.destroy
        render json: nil, status: 200
      end
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
