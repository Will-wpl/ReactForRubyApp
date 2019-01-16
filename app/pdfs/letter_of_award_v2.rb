class LetterOfAwardV2 < LetterOfAward

  def get_price_table_data(param, visibility = false, price_data_bool = false)
    auction_result, auction_contract =  param[:auction_result], param[:auction_contract]

    visibilities = {visibility_lt: is_visibility('LT', param), visibility_hts: is_visibility('HTS', param), visibility_htl: is_visibility('HTL', param), visibility_eht: is_visibility('EHT', param)}
    price_table_data, visibilities, price_hash, price_data = get_contract_duration_price(auction_contract, auction_result, visibilities)

    @price_data = price_data
    @visibilities_price = visibilities
    return price_table_data, visibilities, price_hash, price_data
  end

  def is_visibility(intake_level, param)
    peak, off_peak = get_intake_level_data(intake_level, param)
    if peak == 0.0 && off_peak == 0.0
      false
    else
      true
    end
  end

  def get_consumption_table_data(param)
    row0_data, row1_data = [], []
    param[:row0_data] = row0_data
    param[:row1_data] = row1_data
    param[:key] = :visibility_lt
    push_data('LT', param)
    param[:key] = :visibility_hts
    push_data('HTS', param)
    param[:key] = :visibility_htl
    push_data('HTL', param)
    param[:key] = :visibility_eht
    push_data('EHT', param)

    return nil, [row0_data, row1_data]
  end

  def push_data(intake_level, param)
    visibilities = param[:visibilities]
    if visibilities[param[:key]]
      peak, off_peak = get_intake_level_data(intake_level, param)
      param[:row0_data].push(peak)
      param[:row1_data].push(off_peak)

    end
  end

  def get_intake_level_data(intake_level, param)
    consumption_details = param[:consumption_details]
    peak, off_peak = 0.0, 0.0
    consumption_details.each {|item|
      if item.intake_level === intake_level
        peak += item.peak
        off_peak += item.off_peak
      end
    }
    return peak, off_peak
  end

  def get_premise_address(consumption_detail)
    blk_or_unit = consumption_detail.blk_or_unit
    street = consumption_detail.street
    unit_number = consumption_detail.unit_number
    postal_code = consumption_detail.postal_code
    "#{blk_or_unit} #{street} #{unit_number} #{postal_code}"
  end

  def get_template_content
    return nil if param[:auction_result][0].blank?
    template_id = nil
    if pdf_template_type == RichTemplate::LETTER_OF_AWARD_TEMPLATE
      template_id = param[:auction_result][0].parent_template_id
    elsif pdf_template_type == RichTemplate::NOMINATED_ENTITY_TEMPLATE
      template_id = param[:auction_result][0].entity_template_id
    end

    pdf_template = RichTemplate.find_by id: template_id unless template_id.nil?
    return nil if pdf_template.nil?
    Nokogiri::HTML(pdf_template.content, nil, 'UTF-8')
  end

  def get_content_gsub(param, page_content, page)
    page_content = super(param, page_content, page)
    page_content = page_content.gsub(/#electricity_purchase_contract/, get_electricity_purchase_contract)

  end


  def parse_extends(page, page_content)
    page_content = parse_table(page, @visibilities_price, @price_data, page_content, '#appendix_table3', 4)
    page_content = parse_table(page, @visibilities_price, get_aggregate_consumption_data, page_content, '#appendix_table4')
    terms_and_conditions_of_use(page, page_content)
  end

  def terms_and_conditions_of_use(page, page_content)
    if param[:current_user]&.has_role?(:admin)

      file_path = if param[:is_retailer]
                      visibility2, retailer_file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_REVV_TC)
                      retailer_file_path
                    else
                      visibility, buyer_file_path = get_tc_attach_path(param, UserAttachment::FileType_Buyer_REVV_TC)
                      buyer_file_path
                    end
      parse_terms_and_conditions(page, page_content, file_path)
    elsif param[:current_user]&.has_role?(:buyer)
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Buyer_REVV_TC)
      parse_terms_and_conditions(page, page_content, file_path)
    elsif param[:current_user]&.has_role?(:retailer)
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_REVV_TC)
      parse_terms_and_conditions(page, page_content, file_path)
    end
  end

  def parse_terms_and_conditions(page, page_content, file_path)
    file_path = if file_path.nil?
                  '#'
                else
                  file_path
                end
    page_content.gsub(/#terms_and_conditions_of_use/, file_path)
  end

  def get_aggregate_consumption_data
    auction_contract = param[:auction_contract]
    peak_row, off_peak_row = [], []
    push_aggregate_data({:peak => auction_contract.total_lt_peak, :off_peak => auction_contract.total_lt_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_lt])
    push_aggregate_data({:peak => auction_contract.total_hts_peak, :off_peak => auction_contract.total_hts_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_hts])
    push_aggregate_data({:peak => auction_contract.total_htl_peak, :off_peak => auction_contract.total_htl_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_htl])
    push_aggregate_data({:peak => auction_contract.total_eht_peak, :off_peak => auction_contract.total_eht_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_eht])
    [peak_row, off_peak_row]
  end

  def push_aggregate_data(param, visibility)
    return unless visibility
    peak, off_peak = param[:peak], param[:off_peak]
    peak_row, off_peak_row = param[:peak_row], param[:off_peak_row]
    is_zero = false
    is_zero = true if (peak == 0 || peak.blank?) && (off_peak == 0 || off_peak.blank?)
    unless is_zero
      peak_row.push(peak)
      off_peak_row.push(off_peak)
    end
  end

  def get_electricity_purchase_contract
    request_attachment = nil
    unless param[:auction].request_auction_id.nil?
      request_attachment = RequestAttachment.find_by request_auction_id: param[:auction].request_auction_id
    end
    if request_attachment.nil?
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_Buyer_TC)
      file_path
    else
      request_attachment.file_path
    end
  end

  def terms_and_conditions_of_use(page, page_content)
    if param[:current_user]&.has_role?(:admin)

      file_path = if param[:is_retailer]
                      visibility2, retailer_file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_REVV_TC)
                      retailer_file_path
                    else
                      visibility, buyer_file_path = get_tc_attach_path(param, UserAttachment::FileType_Buyer_REVV_TC)
                      buyer_file_path
                    end
      parse_terms_and_conditions(page, page_content, file_path)
    elsif param[:current_user]&.has_role?(:buyer)
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Buyer_REVV_TC)
      parse_terms_and_conditions(page, page_content, file_path)
    elsif param[:current_user]&.has_role?(:retailer)
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_REVV_TC)
      parse_terms_and_conditions(page, page_content, file_path)
    end
  end

  def parse_terms_and_conditions(page, page_content, file_path)
    file_path = if file_path.nil?
                  '#'
                else
                  file_path
                end
    page_content.gsub(/#terms_and_conditions_of_use/, file_path)
  end

  def get_aggregate_consumption_data
    auction_contract = param[:auction_contract]
    peak_row, off_peak_row = [], []
    push_aggregate_data({:peak => auction_contract.total_lt_peak, :off_peak => auction_contract.total_lt_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_lt])
    push_aggregate_data({:peak => auction_contract.total_hts_peak, :off_peak => auction_contract.total_hts_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_hts])
    push_aggregate_data({:peak => auction_contract.total_htl_peak, :off_peak => auction_contract.total_htl_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_htl])
    push_aggregate_data({:peak => auction_contract.total_eht_peak, :off_peak => auction_contract.total_eht_off_peak, :peak_row => peak_row, :off_peak_row => off_peak_row}, @visibilities_price[:visibility_eht])
    [peak_row, off_peak_row]
  end

  def push_aggregate_data(param, visibility)
    return unless visibility
    peak, off_peak = param[:peak], param[:off_peak]
    peak_row, off_peak_row = param[:peak_row], param[:off_peak_row]
    is_zero = false
    is_zero = true if (peak == 0 || peak.blank?) && (off_peak == 0 || off_peak.blank?)
    unless is_zero
      peak_row.push(peak)
      off_peak_row.push(off_peak)
    end
  end

  def get_electricity_purchase_contract
    request_attachment = nil
    unless param[:auction].request_auction_id.nil?
      request_attachment = RequestAttachment.find_by request_auction_id: param[:auction].request_auction_id
    end
    if request_attachment.nil?
      visibility, file_path = get_tc_attach_path(param, UserAttachment::FileType_Seller_Buyer_TC)
      file_path
    else
      request_attachment.file_path
    end
  end

  def get_tc_attach_path(param, type)
    return false, '#' if param[:auction].tc_attach_info.nil?
    tc_id = Auction.get_tc_attach_info_id(param[:auction].tc_attach_info, type)
    attachment = UserAttachment.find_by_id(tc_id)
    file_path = if attachment.nil?
                  '#'
                else
                  attachment.file_path
                end
    return true, file_path
  end
end