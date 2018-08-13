class Api::ConsumptionDetailsController < Api::BaseController
  before_action :set_consumption, only: %i[index save participate reject validate]
  def index
    unless params[:consumption_id].nil?
      consumption = @consumption
      consumption_details = consumption.consumption_details
      auction = consumption.auction
      contract_duration = auction.auction_contracts.select('contract_duration').sort_by {|contract| contract.contract_duration.to_i}
      buyer_entities = CompanyBuyerEntity.find_by_status_user(CompanyBuyerEntity::ApprovalStatusApproved, consumption.user_id).order(is_default: :desc)
      if auction.auction_contracts.blank?
        tc_attachment = AuctionAttachment.find_by(auction_id: consumption.auction_id, file_type: 'buyer_tc_upload')
      else
        # tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
        tc_attachment = UserAttachment.find_by_type_user(UserAttachment::FileType_Buyer_REVV_TC, consumption.user_id)
      end
      consumption_details_all = []
      consumption_details.each do |consumption_detail|
        if consumption_detail.user_attachment_id.blank?
          user_attachments = nil
        else
          # user_attachment = UserAttachment.find_by_id(consumption_detail.user_attachment_id)
          user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id, consumption.user_id, UserAttachment::FileType_Consumption_Detail_Doc)
        end
        final_detail = {
            "id" => consumption_detail.id,
            "account_number" => consumption_detail.account_number,
            "intake_level" => consumption_detail.intake_level,
            "peak" => consumption_detail.peak,
            "off_peak" => consumption_detail.off_peak,
            "consumption_id" => consumption_detail.consumption_id,
            "created_at" => consumption_detail.created_at,
            "updated_at" => consumption_detail.updated_at,
            "premise_address" => consumption_detail.premise_address,
            "contracted_capacity" => consumption_detail.contracted_capacity,
            "existing_plan" => consumption_detail.existing_plan,
            "contract_expiry" => consumption_detail.contract_expiry,
            "blk_or_unit" => consumption_detail.blk_or_unit,
            "street" => consumption_detail.street,
            "unit_number" => consumption_detail.unit_number,
            "postal_code" => consumption_detail.postal_code,
            "totals" => consumption_detail.totals,
            "peak_pct" => consumption_detail.peak_pct,
            "company_buyer_entity_id" => consumption_detail.company_buyer_entity_id,
            "user_attachment_id" => consumption_detail.user_attachment_id,
            "user_attachment" =>user_attachments
        }
        consumption_details_all.push(final_detail)
      end
      render json: { consumption_details: consumption_details_all, consumption: consumption,
                     auction: { id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time, contract_period_start_date: auction.contract_period_start_date, publish_status: auction.publish_status },
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
        # update - new fields (20180709) - Start
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
        # consumption_detail.user_attachment_id = detail['user_attachment_id']
        # Update -new fields (20180709) - End
        # update - new fields (20180726) - Start
        # consumption_detail.approval_status = ConsumptionDetail::ApprovalStatusPending
        # update - new fields (20180726) - End
        consumption_detail.consumption_id = params[:consumption_id]
        if consumption_detail.save!
          saved_details.push(consumption_detail)
          attachment_id_array = JSON.parse(detail['attachment_ids'])
          UserAttachment.find_by_ids(attachment_id_array).update(consumption_detail_id: consumption_detail.id)
        end
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

      auction_name = auction.name
      auction_start_datetime = auction.start_datetime.strftime('%Y-%m-%d %H:%M:%S').to_s
      consumption.comments = nil
      consumption.accept_status = Consumption::AcceptStatusPending
      if consumption.save!
        # Change -- [do not save acution. move this logic to admin approval logic] - Start
        #  -- Original
        # if consumption.contract_duration.blank?
        #   days = Auction.get_days(auction.contract_period_start_date, auction.contract_period_end_date)
        #   auction = set_participate_auction_total(auction, intake_values, days)
        #   if auction.save!
        #     send_participated_mail(auction_name, auction_start_datetime)
        #     render json: consumption, status: 200
        #   else
        #     render json: nil, status: 500
        #   end
        # else
        #   auction_contract = auction.auction_contracts.where('contract_duration = ?', consumption.contract_duration).take
        #   days = Auction.get_days(auction.contract_period_start_date, auction_contract.contract_period_end_date)
        #   auction_contract = set_participate_auction_contract_total(auction_contract, intake_values, days)
        #   if auction_contract.save!
        #     send_participated_mail(auction_name, auction_start_datetime)
        #     render json: consumption, status: 200
        #   else
        #     render json: nil, status: 500
        #   end
        # end
        # -- Now logic - 20170726
        send_participated_mail(auction_name, auction_start_datetime)
        render json: consumption, status: 200
        # Change -- [do not save acution. move this logic to admin approval logic] - End
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
    check_result = account_number_unique(auction, details)
    error_detail_indexes.concat(check_result[0])
    messages.concat(check_result[1])
    # Account number cannot be same with any unexpired contracts of this buyer.
    # Other check
    check_result = consumption_other_check(auction, details)
    error_detail_indexes.concat(check_result[0])
    messages.concat(check_result[1])

    error_detail_indexes = error_detail_indexes.uniq
    return_json = {validate_result: error_detail_indexes.blank?,
                   error_detail_indexes: error_detail_indexes,
                   error_messages: messages}
    render json: return_json, status: 200
  end

  def consumption_other_check(auction, details)
    messages = []
    error_detail_indexes = []
    had_error_msg_addr = false
    had_error_msg_acc = false
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

    [error_detail_indexes, messages]
  end

  def account_number_unique(auction, details)
    messages = []
    error_detail_indexes = []
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
    [error_detail_indexes, messages]
  end

  def reject
    consumption = @consumption
    consumption.participation_status = '0'
    consumption.save
    render json: consumption, status: 200
  end

  private

  # Send participated notification to admin when user click participate button in consumption details page
  def send_participated_mail(auction_name,auction_start_datetime)
    User.admins.each do |admin_user|
      UserMailer.buyer_participate(admin_user, {:buyer_company_name => current_user.name,
                                                :name_of_ra => auction_name,
                                                :date_time => auction_start_datetime}).deliver_later
    end
  end

  def set_consumption
    @consumption = if current_user.has_role?('admin')
                     Consumption.admin_find_by_id(params[:consumption_id])
                   else
                     current_user.consumptions.find(params[:consumption_id])
                   end
  end

end
