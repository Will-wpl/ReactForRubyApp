class Api::ConsumptionDetailsController < Api::BaseController
  before_action :set_consumption, only: %i[index save participate reject validate]
  def index
    unless params[:consumption_id].nil?
      consumption_id = params[:consumption_id].to_i
      consumption = Consumption.find(consumption_id) # @consumption
      consumption_details = consumption.consumption_details
      consumption_details_new = []
      consumption_details.each { |detail| consumption_details_new.push(detail) if detail.draft_flag.blank?}
      auction = consumption.auction
      contract_duration = auction.auction_contracts.select('contract_duration').sort_by {|contract| contract.contract_duration.to_i}
      # buyer_entities = CompanyBuyerEntity.find_by_status_user(CompanyBuyerEntity::ApprovalStatusApproved, consumption.user_id).order(is_default: :desc)
      buyer_entities = CompanyBuyerEntity.where('user_id = ? and approval_status in (?)', consumption.user_id, [CompanyBuyerEntity::ApprovalStatusApproved , CompanyBuyerEntity::ApprovalStatusPending])
      if auction.auction_contracts.blank?
        buyer_revv_tc_attachment = AuctionAttachment.find_by(auction_id: consumption.auction_id, file_type: 'buyer_tc_upload')
        seller_buyer_tc_attachment = nil
      else
        # tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
        # tc_attachment = UserAttachment.find_by_type_user(UserAttachment::FileType_Buyer_REVV_TC, consumption.user_id)
        # get seller-buyer-t&c document
        seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
        # get buyer-revv-t&c document
        buyer_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
      end
      consumption_details_all = []
      consumption_details_new.each do |consumption_detail|
        # if consumption_detail.user_attachment_id.blank?
        #   user_attachments = nil
        # else
        # user_attachment = UserAttachment.find_by_id(consumption_detail.user_attachment_id)
        user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id, consumption.user_id, UserAttachment::FileType_Consumption_Detail_Doc)
        # end
        attachment_ids = []
        user_attachments.each{ |x| attachment_ids.push(x.id) }
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
            "user_attachment" =>user_attachments,
            "attachment_ids" => attachment_ids.to_json
        }
        consumption_details_all.push(final_detail)
      end
      only_read_records = !consumption_details_all.blank?

          # get yesterday consumption details
      consumption_details_yesterday = consumption.consumption_details.where('draft_flag = ?', 1)
      consumption_details_all_yesterday = consumption_details_yesterday(consumption_details_yesterday, auction, consumption, only_read_records)

      # get before yesterday consumption details
      consumption_details_before_yesterday = consumption.consumption_details.where('draft_flag = ?', 2)
      consumption_details_all_before_yesterday = consumption_details_before_yesterday(consumption_details_before_yesterday, auction, consumption, only_read_records)
      removed_consumption_details = []
      consumption_details_all_before_yesterday.each do |consumption_detail|
        if consumption_details_all_yesterday.any?{ |x| x['account_number'] == consumption_detail['account_number'] }
          removed_consumption_details.push(consumption_detail)
        end
      end
      removed_consumption_details.each do |consumption_detail|
        consumption_details_all_before_yesterday.delete(consumption_detail)
      end
      advisory_template = RichTemplate.find_by type: RichTemplate::ADVISORY_TEMPLATE
      render json: { consumption_details: consumption_details_all,
                     consumption_details_last_day: consumption_details_all_yesterday,
                     consumption_details_before_yesterday: consumption_details_all_before_yesterday,
                     consumption: consumption,
                     auction: { id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time,
                                contract_period_start_date: auction.contract_period_start_date,
                                publish_status: auction.publish_status },
                     buyer_entities: buyer_entities, seller_buyer_tc_attachment:seller_buyer_tc_attachment,
                     buyer_revv_tc_attachment: buyer_revv_tc_attachment, contract_duration: contract_duration, advisory: advisory_template }, status: 200
    end
  end

  def detail_validate_form(detail)
    {
        "id" => detail['id'],
        "account_number" => detail['account_number'],
        "unit_number" => detail['unit_number'],
        "postal_code" => detail['postal_code'],
        "orignal_id" => detail['orignal_id']
    }
  end

  def validate_all_details
    error_all = []
    # details = JSON.parse(params[:details])
    details_yesterday = JSON.parse(params[:details_yesterday])
    details_before_yesterday = JSON.parse(params[:details_before_yesterday])

    consumption = @consumption

    # Category 1
    unless details_yesterday.blank?
      errors_category_1 = []
      details_yesterday.each_index do |index|
        consumption_detail = detail_validate_form(details_yesterday.at(index))
        error = validate_consumption_detail(consumption_detail, consumption)
        errors_category_1.push(consumption_detail_include_index(index,consumption_detail)) unless error.blank?
      end
      error_all.push({type:'category_1', error_details: errors_category_1}) unless errors_category_1.blank?
    end

    # Category 2
    unless details_before_yesterday.blank?
      errors_category_2 = []
      details_before_yesterday.each_index do |index|
        consumption_detail = detail_validate_form(details_before_yesterday.at(index))
        error = validate_consumption_detail(consumption_detail, consumption)
        errors_category_2.push(consumption_detail_include_index(index,consumption_detail)) unless error.blank?
      end
      error_all.push({type:'category_2', error_details: errors_category_2}) unless errors_category_2.blank?
    end

    # New
    # unless details.blank?
    #   errors_new = []
    #   details.each_index do |index|
    #     consumption_detail = detail_validate_form(details.at(index))
    #     error = validate_consumption_detail(consumption_detail, consumption)
    #     errors_new.push(consumption_detail_include_index(index,consumption_detail)) unless error.blank?
    #   end
    #   error_all.push({type:'new', error_details: errors_new}) unless errors_new.blank?
    # end
    error_all
  end

  def consumption_detail_include_index(index,consumption_detail)
    {
        index: index,
        account_number: consumption_detail['account_number'],
        unit_number: consumption_detail['unit_number'],
        postal_code: consumption_detail['postal_code']
    }
  end

  def save
    error_all = validate_all_details
    if error_all.blank?
      saved_details = save_comsumption_details()
      render json: { result: 'success', details: saved_details}, status: 200
    else
      render json: { result: 'failed', errors: error_all}, status: 200
    end
  end

  def participate
    error_all = validate_all_details
    unless error_all.blank?
      render json: { result: 'failed', errors: error_all} , status: 200
      return
    end
    ActiveRecord::Base.transaction do
      save_comsumption_details()
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
      consumption.is_saved = 1
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
        render json: {result: 'success' ,consumption: consumption}, status: 200
        # Change -- [do not save acution. move this logic to admin approval logic] - End
      else
        render json: nil, status: 500
      end

    end
    
  end

  def validate_single
    detail = params[:detail]
    current_consumption = Consumption.find(params[:consumption_id]) #@consumption
    is_new = params[:is_new]
    if is_new == 0
      error_details = validate_consumption_detail(detail, current_consumption)
    else
      error_details = validate_duplicated_consumption_detail(detail)
    end

    return_json = { validate_result: error_details.blank?, error_details: error_details }
    render json: return_json, status: 200
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
          error_detail_indexes.push({'consumption_detail_index': index,
                                     'error_field_name': 'account_number',
                                     'error_value': details[index]['account_number']})
          messages.push('There is already an existing contract for this Account Number.') unless had_error_msg_acc
          had_error_msg_acc = true
        end
        # If both Unit Number and Postal Code are the same, then fail the check.
        if details[index].object_id != temp_detail.object_id && details[index]['unit_number'] == temp_detail['unit_number'] &&
            details[index]['postal_code'] == temp_detail['postal_code'] then
          error_detail_indexes.push({'consumption_detail_index': index,
                                     'error_field_name': 'premise_address',
                                     'error_value': { 'unit_number': details[index]['unit_number'],
                                                      'postal_code': details[index]['postal_code']}})
          messages.push('There is already an existing contract for this premise address.') unless had_error_msg_addr
          had_error_msg_addr = true
        end
      end
      # contract expiry date > RA's contract start date.
      if !details[index]['contract_expiry'].blank? &&
          Time.parse(details[index]['contract_expiry']) <= auction.contract_period_start_date
        error_detail_indexes.push({'consumption_detail_index': index,
                                   'error_field_name': 'contract_expiry',
                                   'error_value': details[index]['contract_expiry']})
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
        error_detail_indexes.push({'consumption_detail_index': index,
                                  'error_field_name': 'account_number',
                                  'error_value': details[index]['account_number']})
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

  def validate_duplicated_consumption_detail(detail)
    error_details = []
    validated_detail = detail_validate_form(detail)
    duplicated_account_details = ConsumptionDetail.find_duplicated_account_number(validated_detail['account_number'],
                                                                                  validated_detail['id'])
    unless duplicated_account_details.blank?
      error_details.push({ 'error_field_name': 'account_number', 'error_value': validated_detail['account_number']})
    end

    duplicated_address_details = ConsumptionDetail.find_duplicated_address(validated_detail['unit_number'],
                                                                            validated_detail['postal_code'],
                                                                            validated_detail['id'])
    unless duplicated_address_details.blank?
      error_details.push({ 'error_field_name': 'premise_addresses',
                           'error_value': { unit_number: validated_detail['unit_number'],
                                            postal_code: validated_detail['postal_code']}})
    end
    error_details
  end

  def validate_consumption_detail(detail,current_consumption)
    error_details = []
    # consumptions = Consumption.all #mine(current_user.id)
    auction = Auction.find(current_consumption.auction_id)
    raise ActiveRecord::RecordNotFound if auction.nil?
    contract_period_start_date = auction.contract_period_start_date

    # contract_period_start_date, contract_period_end_date = get_auction_period(current_consumption)
    # Account must be unique within a RA.
    account_numbers = []
    premise_addresses = []
    validate_info =ConsumptionDetail.validation_info(current_consumption.id, current_consumption.contract_duration.to_i, contract_period_start_date)
    unless validate_info.blank?
      validate_info.each do |info|
        account_number = info.account_number.nil? ? '' : info.account_number
        unit_number = info.unit_number.nil? ? '' : info.unit_number
        postal_code = info.postal_code.nil? ? '' : info.postal_code
        account_numbers.push(account_number) unless account_numbers.any?{|x| x == account_number}
        unless premise_addresses.any?{|x| x['unit_number'] == unit_number && x['postal_code'] == postal_code }
          premise_addresses.push({ 'unit_number' => unit_number, 'postal_code' => postal_code})
        end
      end
    end
    # consumptions.each do |consumption|
    #   temp_contract_period_start_date ,temp_contract_period_end_date = get_auction_period(consumption)
    #
    #   next if consumption.id == current_consumption.id || consumption.participation_status == Consumption::ParticipationStatusReject || consumption.accept_status == Consumption::AcceptStatusReject
    #   consumption.consumption_details.each do |consumption_detail|
    #     consumption_detail_id = detail['id'].blank? ? detail['orignal_id'] : detail['id']
    #     if temp_contract_period_start_date.nil? ||
    #         temp_contract_period_end_date.nil? ||
    #         temp_contract_period_end_date < contract_period_start_date
    #       next
    #     end
    #
    #     if !consumption_detail.account_number.blank? && consumption_detail.id.to_s != consumption_detail_id
    #       account_numbers.push(consumption_detail.account_number)
    #     end
    #
    #
    #     if !consumption_detail.unit_number.blank? && !consumption_detail.postal_code.blank? &&
    #         consumption_detail.id.to_s != consumption_detail_id
    #       premise_addresses.push({ 'unit_number' => consumption_detail.unit_number,
    #                                'postal_code' => consumption_detail.postal_code})
    #     end
    #   end
    # end

    if detail['account_number'].blank? ||
        (!detail['account_number'].blank? && account_numbers.any? { |v| v.downcase == detail['account_number'].downcase })
      error_details.push({ 'error_field_name': 'account_number',
                           'error_value': detail['account_number']})
    end

    if detail['unit_number'].blank? ||
        detail['postal_code'].blank? ||
        (!detail['unit_number'].blank? &&
            !detail['postal_code'].blank? &&
            premise_addresses.any? { |v| v['unit_number'].downcase == detail['unit_number'].downcase && v['postal_code'].downcase == detail['postal_code'].downcase })
      error_details.push({ 'error_field_name': 'premise_addresses',
                           'error_value': { unit_number: detail['unit_number'],
                                            postal_code: detail['postal_code']}})
    end

    # contract expiry date > RA's contract start date.
    # if !detail['contract_expiry'].blank? &&
    #     Time.parse(detail['contract_expiry']) <= auction.contract_period_start_date
    #   error_details.push({ 'error_field_name': 'contract_expiry',
    #                        'error_value': detail['contract_expiry']})
    # end
    error_details
  end

  def get_auction_period(consumption)
    auction = Auction.find(consumption.auction_id)
    raise ActiveRecord::RecordNotFound if auction.nil?
    period_start_date = auction.contract_period_start_date
    if consumption.contract_duration.blank?
      period_end_date = auction.contract_period_end_date
    else
      auction_contract = AuctionContract.find_by auction_id: consumption.auction_id, contract_duration: consumption.contract_duration
      if auction_contract.nil?
        months = consumption.contract_duration.to_i
        period_end_date = period_start_date + months.months
      else
        period_end_date = auction_contract.contract_period_end_date
      end
      # period_end_date = auction_contract.nil? ? auction.contract_period_end_date: auction_contract.contract_period_end_date
    end
    [period_start_date ,period_end_date]
  end

  def consumption_details_before_yesterday(consumption_details_before_yesterday, auction, consumption, only_read_records = false)
    consumption_details_all_before_yesterday = []
    if consumption.is_saved != 1 && !only_read_records # consumption_details_before_yesterday.blank?
      details = ConsumptionDetail.find_account_less_than_contract_start_date_last(auction.contract_period_start_date,current_user.id)
      details.each do |consumption_detail|
        user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id,
                                                                                   consumption.user_id,
                                                                                   UserAttachment::FileType_Consumption_Detail_Doc)
        attachment_ids = []
        user_attachments.each{ |x| attachment_ids.push(x.id) }
        final_detail = put_in_consuption_detail(consumption_detail,
                                                user_attachments, attachment_ids,
                                                ConsumptionDetail::DraftFlagBeforeYesterday)
        consumption_details_all_before_yesterday.push(final_detail)
      end
    else
      consumption_details_before_yesterday.each do |consumption_detail|
        user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id,
                                                                                   consumption.user_id,
                                                                                   UserAttachment::FileType_Consumption_Detail_Doc)
        attachment_ids = []
        user_attachments.each{ |x| attachment_ids.push(x.id) }
        final_detail = put_in_consuption_detail(consumption_detail,
                                                user_attachments,
                                                attachment_ids)
        consumption_details_all_before_yesterday.push(final_detail)
      end
    end
    consumption_details_all_before_yesterday
  end

  def consumption_details_yesterday(consumption_details_yesterday, auction, consumption, only_read_records = false)
    consumption_details_all_yesterday = []
    if consumption.is_saved != 1 && !only_read_records #consumption_details_yesterday.blank?
      details = ConsumptionDetail.find_account_equal_to_contract_start_date_last(auction.contract_period_start_date, current_user.id)
      details.each do |consumption_detail|
        user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id,
                                                                                   consumption.user_id,
                                                                                   UserAttachment::FileType_Consumption_Detail_Doc)
        attachment_ids = []
        user_attachments.each{ |x| attachment_ids.push(x.id) }
        final_detail = put_in_consuption_detail(consumption_detail,
                                                user_attachments,
                                                attachment_ids,
                                                ConsumptionDetail::DraftFlagYesterday)
        consumption_details_all_yesterday.push(final_detail)
      end
    else
      consumption_details_yesterday.each do |consumption_detail|
        user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id,
                                                                                   consumption.user_id,
                                                                                   UserAttachment::FileType_Consumption_Detail_Doc)
        attachment_ids = []
        user_attachments.each{ |x| attachment_ids.push(x.id) }
        final_detail = put_in_consuption_detail(consumption_detail,
                                                user_attachments,
                                                attachment_ids)
        consumption_details_all_yesterday.push(final_detail)
      end
    end
    consumption_details_all_yesterday
  end

  def put_in_consuption_detail(consumption_detail,user_attachments, attachment_ids, draft_flag = nil)
    if draft_flag ==  ConsumptionDetail::DraftFlagYesterday
      existing_plan = consumption_detail.existing_plan
    elsif draft_flag ==  ConsumptionDetail::DraftFlagBeforeYesterday
      existing_plan = nil
    else
      existing_plan = consumption_detail.existing_plan
    end

    if draft_flag ==  ConsumptionDetail::DraftFlagYesterday
      contract_expiry = consumption_detail.contract_period_end_date
    elsif draft_flag ==  ConsumptionDetail::DraftFlagBeforeYesterday
      contract_expiry = nil
    else
      contract_expiry = consumption_detail.contract_expiry
    end

    final_detail = {
        "id" => draft_flag.blank? ? consumption_detail.id : nil,
        "orignal_id" => draft_flag.blank? ? nil : consumption_detail.id,
        "account_number" => consumption_detail.account_number,
        "intake_level" => consumption_detail.intake_level,
        "peak" => consumption_detail.peak,
        "off_peak" => consumption_detail.off_peak,
        "consumption_id" => consumption_detail.consumption_id,
        "created_at" => consumption_detail.created_at,
        "updated_at" => consumption_detail.updated_at,
        "premise_address" => consumption_detail.premise_address,
        "contracted_capacity" => consumption_detail.contracted_capacity,
        "existing_plan" => existing_plan,
        "contract_expiry" => contract_expiry,
        "blk_or_unit" => consumption_detail.blk_or_unit,
        "street" => consumption_detail.street,
        "unit_number" => consumption_detail.unit_number,
        "postal_code" => consumption_detail.postal_code,
        "totals" => consumption_detail.totals,
        "peak_pct" => consumption_detail.peak_pct,
        "company_buyer_entity_id" => consumption_detail.company_buyer_entity_id,
        "user_attachment_id" => consumption_detail.user_attachment_id,
        "user_attachment" =>user_attachments,
        "attachment_ids" => attachment_ids.to_json,
        "draft_flag" => draft_flag}
    final_detail
  end

  def save_comsumption_details()
    @consumption.contract_duration = params[:contract_duration]
    @consumption.update(contract_duration: params[:contract_duration])
    consumption = @consumption
    details_all = []
    details = JSON.parse(params[:details])
    details_yesterday = JSON.parse(params[:details_yesterday])
    details_before_yesterday = JSON.parse(params[:details_before_yesterday])
    details_all.concat(details)
    details_all.concat(details_yesterday)
    details_all.concat(details_before_yesterday)
    ids = []
    details_all.each do |detail|
      ids.push(detail['id'].to_s) if detail['id'].to_i != 0
    end
    will_del_details = consumption.consumption_details.reject do |detail|
      ids.include?(detail.id.to_s)
    end
    will_del_details.each do |detail|
      ConsumptionDetail.find(detail.id).destroy
    end
    saved_details = []
    ActiveRecord::Base.transaction do
      consumption.is_saved = 1
      consumption.save!
      saved_details.concat(save_details(details))
      saved_details.concat(save_details(details_yesterday, ConsumptionDetail::DraftFlagYesterday))
      saved_details.concat(save_details(details_before_yesterday, ConsumptionDetail::DraftFlagBeforeYesterday))
    end
    saved_details
  end

  def save_details(details, draft_flag = nil)
    saved_details = []
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
      consumption_detail.peak = (detail['totals'].to_f * detail['peak_pct'].to_f / 100).round() unless detail['peak_pct'].blank?
      consumption_detail.off_peak = detail['totals'].to_i - consumption_detail.peak unless detail['peak_pct'].blank?
      consumption_detail.contract_expiry = Date.parse(detail['contract_expiry']) unless detail['contract_expiry'].blank?
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
      consumption_detail.draft_flag = draft_flag
      if consumption_detail.save!
        saved_details.push(consumption_detail)
        unless detail['attachment_ids'].blank?
          attachment_id_array = JSON.parse(detail['attachment_ids'])
          UserAttachment.find_by_ids(attachment_id_array).update(consumption_detail_id: consumption_detail.id)
        end
      end
    end
    saved_details
  end

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
