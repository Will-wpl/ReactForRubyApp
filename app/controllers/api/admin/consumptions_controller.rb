class Api::Admin::ConsumptionsController < Api::ConsumptionsController
  before_action :admin_required

  # Approval Consumption
  # Params:
  #   consumption_id  -> Indicate the consumption's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_consumption
    target_consumption = Consumption.find(params[:consumption_id])
    approval_status = params[:approved].blank? ? Consumption::AcceptStatusReject : Consumption::AcceptStatusApproved
    comment = params[:comment]
    participate_status = target_consumption.participation_status if approval_status == Consumption::AcceptStatusApproved
    participate_status = Consumption::ParticipationStatusPending if approval_status == Consumption::AcceptStatusReject
    auction_name = target_consumption.auction.name
    auction_start_datetime = target_consumption.auction.start_datetime.strftime('%Y-%m-%d %H:%M:%S').to_s

    if approval_status == Consumption::AcceptStatusApproved
      # Change -- [Update Action once approved consumption] - Start
      target_consumption.update(accept_status: approval_status,
          participation_status: participate_status,
          approval_date_time: Time.current,
          comments: comment)
      render json: nil , status:500 unless update_auction_approval(target_consumption)
      # Change -- [Update Action once approved consumption] - End
      UserMailer.buyer_participate_approved(target_consumption.user,
                                            { :name_of_ra => auction_name,
                                              :date_time => auction_start_datetime,
                                              :comment => comment
                                            }).deliver_later
    elsif approval_status == Consumption::AcceptStatusReject
      # Change -- [Update Action once approved consumption] - Start
      target_consumption.update(accept_status: approval_status,
                                participation_status: participate_status,
                                approval_date_time: Time.current,
                                comments: comment,
                                lt_peak: 0,
                                lt_off_peak: 0,
                                hts_peak: 0,
                                hts_off_peak: 0,
                                htl_peak: 0,
                                htl_off_peak: 0,
                                eht_peak: 0,
                                eht_off_peak: 0)
      # Change -- [Update Action once approved consumption] - End
      UserMailer.buyer_participate_rejected(target_consumption.user,
                                            { :name_of_ra => auction_name,
                                              :date_time => auction_start_datetime,
                                              :comment => comment
                                            }).deliver_later
    end
    render json: { consumption_info: target_consumption }, status:200
  end

  private

  def update_auction_approval(consumption)
    auction = Auction.find(consumption.auction_id)
    values = []
    consumption.consumption_details.each do |consumption_detail|
      values.push(Consumption.convert_intake_value(consumption_detail.intake_level, consumption_detail.peak, consumption_detail.off_peak))
    end

    intake_values = Consumption.set_intake_value(values)
    if consumption.contract_duration.blank?
      days = Auction.get_days(auction.contract_period_start_date, auction.contract_period_end_date)
      auction = set_participate_auction_total(auction, intake_values, days)
      saved_success = auction.save!
    else
      auction_contract = auction.auction_contracts.where('contract_duration = ?', consumption.contract_duration).take
      days = Auction.get_days(auction.contract_period_start_date, auction_contract.contract_period_end_date)
      auction_contract = set_participate_auction_contract_total(auction_contract, intake_values, days)
      saved_success = auction_contract.save!
    end
    saved_success
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
