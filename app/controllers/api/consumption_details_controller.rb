class Api::ConsumptionDetailsController < Api::BaseController
  def index
    unless params[:consumption_id].nil?
      consumption_details = ConsumptionDetail.find_by_consumption_id(params[:consumption_id])
      consumption = Consumption.find(params[:consumption_id])
      auction = consumption.auction

      tc_attachment = AuctionAttachment.find_by(auction_id: consumption.auction_id, file_type: 'buyer_tc_upload0')
      render json: { consumption_details: consumption_details, consumption: consumption,
                     auction: { id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time },
                     tc_attachment: tc_attachment }, status: 200
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
    consumption = nil
    ActiveRecord::Base.transaction do
      details = JSON.parse(params[:details])
      values = []
      details.each do |detail|
        consumption_detail = ConsumptionDetail.new
        consumption_detail.account_number = detail['account_number']
        consumption_detail.intake_level = detail['intake_level']
        consumption_detail.peak = detail['peak']
        consumption_detail.off_peak = detail['off_peak']
        consumption_detail.consumption_id = params[:consumption_id]
        if consumption_detail.save
          values.push(Consumption.convert_intake_value(consumption_detail.intake_level, consumption_detail.peak, consumption_detail.off_peak))
        end
      end
      consumption = Consumption.find(params[:consumption_id])
      consumption.participation_status = '1'
      intake_values = Consumption.set_intake_value(values)
      consumption.lt_peak = intake_values[0]
      consumption.lt_off_peak = intake_values[1]
      consumption.hts_peak = intake_values[2]
      consumption.hts_off_peak = intake_values[3]
      consumption.htl_peak = intake_values[4]
      consumption.htl_off_peak = intake_values[5]
      consumption.eht_peak = intake_values[6]
      consumption.eht_off_peak = intake_values[7]
      if consumption.save
        # update auction
        auction = Auction.find(consumption.auction_id)
        auction.total_lt_peak += intake_values[0]
        auction.total_lt_off_peak += intake_values[1]
        auction.total_hts_peak += intake_values[2]
        auction.total_hts_off_peak += intake_values[3]
        auction.total_htl_peak += intake_values[4]
        auction.total_htl_off_peak += intake_values[5]
        auction.total_eht_peak += intake_values[6]
        auction.total_eht_off_peak += intake_values[7]
        auction.total_volume = Auction.set_total_volume(
            auction.total_lt_peak, auction.total_lt_off_peak, auction.total_hts_peak, auction.total_hts_off_peak,
            auction.total_htl_peak, auction.total_htl_off_peak, auction.total_eht_peak, auction.total_eht_off_peak
        )
        auction.save
      end
    end
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
