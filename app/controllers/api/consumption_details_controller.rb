class Api::ConsumptionDetailsController < Api::BaseController
  before_action :set_consumption, only: %i[index save participate reject]
  def index
    unless params[:consumption_id].nil?
      consumption = @consumption
      consumption_details = consumption.consumption_details
      auction = consumption.auction

      tc_attachment = AuctionAttachment.find_by(auction_id: consumption.auction_id, file_type: 'buyer_tc_upload')
      render json: { consumption_details: consumption_details, consumption: consumption,
                     auction: { id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time, publish_status: auction.publish_status },
                     tc_attachment: tc_attachment }, status: 200
    end
  end

  def save
    consumption = @consumption
    details = JSON.parse(params[:details])
    ids = []
    details.each do |detail|
      ids.push(detail['id']) if detail['id'].to_i != 0
    end
    will_del_details = consumption.consumption_details.reject do |detail|
      ids.include?(detail.id.to_s)
    end
    will_del_details.each do |detail|
      ConsumptionDetail.find(detail.id).destroy
    end
    saved_details = []
    ActiveRecord::Base.transaction do
      details.each do |detail|
        consumption_detail = if detail['id'].to_i == 0
                               ConsumptionDetail.new
                             else
                               ConsumptionDetail.find(detail['id'])
                             end
        consumption_detail.account_number = detail['account_number']
        consumption_detail.intake_level = detail['intake_level']
        consumption_detail.peak = detail['peak']
        consumption_detail.off_peak = detail['off_peak']
        consumption_detail.premise_address = detail['premise_address']
        consumption_detail.contracted_capacity = detail['contracted_capacity']
        consumption_detail.consumption_id = params[:consumption_id]
        saved_details.push(consumption_detail) if consumption_detail.save!
      end
    end

    render json: saved_details, status: 200
  end

  def participate
    ActiveRecord::Base.transaction do
      consumption = @consumption
      auction = Auction.find(consumption.auction_id)
      raise ActiveRecord::RecordNotFound if auction.nil?
      days = Auction.get_days(auction.contract_period_start_date, auction.contract_period_end_date)
      values = []
      consumption.consumption_details.each do |consumption_detail|
        values.push(Consumption.convert_intake_value(consumption_detail.intake_level, consumption_detail.peak, consumption_detail.off_peak))
      end
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
      auction.total_lt_peak += intake_values[0]
      if consumption.save!
        auction.total_lt_off_peak += intake_values[1]
        auction.total_hts_peak += intake_values[2]
        auction.total_hts_off_peak += intake_values[3]
        auction.total_htl_peak += intake_values[4]
        auction.total_htl_off_peak += intake_values[5]
        auction.total_eht_peak += intake_values[6]
        auction.total_eht_off_peak += intake_values[7]
        total_volume = Auction.set_total_volume(
          auction.total_lt_peak, auction.total_lt_off_peak, auction.total_hts_peak, auction.total_hts_off_peak,
          auction.total_htl_peak, auction.total_htl_off_peak, auction.total_eht_peak, auction.total_eht_off_peak )
        auction.total_volume = Auction.set_c_value(total_volume, days)
        if auction.save!
          render json: consumption, status: 200
        else
          render json: nil, status: 500
        end
      else
        render json: nil, status: 500
      end
    end
    
  end

  def reject
    consumption = @consumption
    consumption.participation_status = '0'
    consumption.save
    render json: consumption, status: 200
  end

  private

  def set_consumption
    @consumption = if current_user.has_role?('admin')
                     Consumption.admin_find_by_id(params[:consumption_id])
                   else
                     current_user.consumptions.find(params[:consumption_id])
                   end
  end
end
