class Api::ConsumptionDetailsController < Api::BaseController
  before_action :set_consumption, only: %i[index save participate reject validate]
  def index
    unless params[:consumption_id].nil?
      consumption = @consumption
      consumption_details = consumption.consumption_details
      auction = consumption.auction
      contract_duration = auction.auction_contracts.select('contract_duration').sort_by {|contract| contract.contract_duration.to_i}
      buyer_entities = CompanyBuyerEntity.find_by_user(consumption.user_id)
      if auction.auction_contracts.blank?
        tc_attachment = AuctionAttachment.find_by(auction_id: consumption.auction_id, file_type: 'buyer_tc_upload')
      else
        tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
      end
      render json: { consumption_details: consumption_details, consumption: consumption,
                     auction: { id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time, publish_status: auction.publish_status },
                     buyer_entities: buyer_entities,
                     tc_attachment: tc_attachment, contract_duration: contract_duration }, status: 200
    end
  end

  def save
    @consumption.contract_duration = params[:contract_duration]
    @consumption.update(contract_duration: params[:contract_duration])
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
        #update - new fields (20180709) - Start
        consumption_detail.existing_plan = detail['existing_plan']
        consumption_detail.totals = detail['totals']
        consumption_detail.peak_pct = detail['peak_pct']
        consumption_detail.peak = detail['totals'].to_f * detail['peak_pct'].to_f / 100 unless detail['peak_pct'].blank?
        consumption_detail.off_peak = detail['totals'].to_f - consumption_detail.peak unless detail['peak_pct'].blank?
        consumption_detail.contract_expiry = detail['contract_expiry']
        consumption_detail.blk_or_unit = detail['blk_or_unit']
        consumption_detail.street = detail['street']
        consumption_detail.unit_number = detail['unit_number']
        consumption_detail.postal_code = detail['postal_code']
        consumption_detail.company_buyer_entity_id = detail['company_buyer_entity_id']
        #Update -new fields (20180709) - End
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
      if consumption.save!
        if consumption.contract_duration.blank?
          days = Auction.get_days(auction.contract_period_start_date, auction.contract_period_end_date)
          auction = set_participate_auction_total(auction, intake_values, days)
          if auction.save!
            render json: consumption, status: 200
          else
            render json: nil, status: 500
          end
        else
          auction_contract = auction.auction_contracts.where('contract_duration = ?', consumption.contract_duration).take
          days = Auction.get_days(auction.contract_period_start_date, auction_contract.contract_period_end_date)
          auction_contract = set_participate_auction_contract_total(auction_contract, intake_values, days)
          if auction_contract.save!
            render json: consumption, status: 200
          else
            render json: nil, status: 500
          end
        end
      else
        render json: nil, status: 500
      end
    end
    
  end

  # Validate consumption detail
  # Loginc:
  #   1. Account number must be unique within a RA.
  #   2. Account number cannot be same with any unexpired contracts of this buyer.
  #   3. contract expiry date > RA's contract start date.
  #   4. If both Unit Number and Postal Code are the same, then fail the check.
  def validate
    messages = []
    error_detail_indexes = []
    consumption = @consumption
    details = JSON.parse(params[:details])
    auction = Auction.find(consumption.auction_id)
    raise ActiveRecord::RecordNotFound if auction.nil?
    # Account must be unique within a RA.
    account_numbers = []
    auction.consumptions.each do |consumption|
      consumption.consumption_details.each do |consumption_detail|
        account_numbers.push(consumption_detail.account_number)
      end
    end
    had_error_msg_acc = false
    details.each_index do |index|
      if account_numbers.any? { |v| v == details[index]['account_number'] }
        error_detail_indexes.push(index)
        messages.push('There is already an existing contract for this Account Number.') unless had_error_msg_acc
        had_error_msg_acc = true
      end
    end
    # Account number cannot be same with any unexpired contracts of this buyer.
    # contract expiry date > RA's contract start date.
    had_error_msg_addr = false
    details.each_index do |index|
      details.each do |temp_detail|
        if details[index].object_id != temp_detail.object_id && details[index]['account_number'] == temp_detail['account_number']
          error_detail_indexes.push(index)
          messages.push('There is already an existing contract for this Account Number.') unless had_error_msg_acc
          had_error_msg_acc = true
        end
        # If both Unit Number and Postal Code are the same, then fail the check.
        if details[index].object_id != temp_detail.object_id && details[index]['unit_number'] == temp_detail['unit_number'] && details[index]['postal_code'] == temp_detail['postal_code'] then
          error_detail_indexes.push(index)
          messages.push('There is already an existing contract for this premise address.') unless had_error_msg_addr
          had_error_msg_addr = true
        end
      end
      # contract expiry date > RA's contract start date.
      if !details[index]['contract_expiry'].blank? &&
          Time.parse(details[index]['contract_expiry']) <= auction.contract_period_start_date
        error_detail_indexes.push(index)
      end
    end

    error_detail_indexes = error_detail_indexes.uniq
    return_json = {validate_result: error_detail_indexes.blank?,
                   error_detail_indexes: error_detail_indexes,
                   error_messages: messages}
    render json: return_json, status: 200
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

  def set_participate_auction_total(auction, intake_values, days)
    auction.total_lt_peak += intake_values[0]
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
    auction
  end

  def set_participate_auction_contract_total(auction_contract, intake_values, days)
    auction_contract.total_lt_peak = 0 if auction_contract.total_lt_peak.blank?
    auction_contract.total_lt_off_peak = 0 if auction_contract.total_lt_off_peak.blank?
    auction_contract.total_hts_peak = 0 if auction_contract.total_hts_peak.blank?
    auction_contract.total_hts_off_peak = 0 if auction_contract.total_hts_off_peak.blank?
    auction_contract.total_htl_peak = 0 if auction_contract.total_htl_peak.blank?
    auction_contract.total_htl_off_peak = 0 if auction_contract.total_htl_off_peak.blank?
    auction_contract.total_eht_peak = 0 if auction_contract.total_eht_peak.blank?
    auction_contract.total_eht_off_peak = 0 if auction_contract.total_eht_off_peak.blank?
    auction_contract.total_lt_peak += intake_values[0]
    auction_contract.total_lt_off_peak += intake_values[1]
    auction_contract.total_hts_peak += intake_values[2]
    auction_contract.total_hts_off_peak += intake_values[3]
    auction_contract.total_htl_peak += intake_values[4]
    auction_contract.total_htl_off_peak += intake_values[5]
    auction_contract.total_eht_peak += intake_values[6]
    auction_contract.total_eht_off_peak += intake_values[7]
    total_volume = Auction.set_total_volume(
        auction_contract.total_lt_peak, auction_contract.total_lt_off_peak, auction_contract.total_hts_peak, auction_contract.total_hts_off_peak,
        auction_contract.total_htl_peak, auction_contract.total_htl_off_peak, auction_contract.total_eht_peak, auction_contract.total_eht_off_peak )
    auction_contract.total_volume = Auction.set_c_value(total_volume, days)
    auction_contract
  end

end
