class LetterOfAwardV2 < LetterOfAward

  def get_price_table_data(param, visibility = false, price_data_bool = false)
    auction_result, auction_contract =  param[:auction_result], param[:auction_contract]
    price_table_data, visibilities, price_data = get_contract_duration_price(auction_contract, auction_result)

    visibilities = {visibility_lt: is_visibility('LT', param), visibility_hts: is_visibility('HTS', param), visibility_htl: is_visibility('HTL', param), visibility_eht: is_visibility('EHT', param)}
    return price_table_data, visibilities, price_data
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

  def get_content_gsub(param, page_content)
    page_content = super(param, page_content)
    page_content = page_content.gsub(/#procurement_agreement/, get_tc_attach_path(param,UserAttachment::FileType_Seller_Buyer_TC))
    page_content = page_content.gsub(/#seller_platform_terms_of_use/, get_tc_attach_path(param,UserAttachment::FileType_Seller_REVV_TC))
    page_content.gsub(/#buyer_platform_terms_of_use/, get_tc_attach_path(param,UserAttachment::FileType_Buyer_REVV_TC))
  end

  private

  def get_tc_attach_path(param, type)
    return '#' if param[:auction].tc_attach_info.nil?
    tc_id = Auction.get_tc_attach_info_id(param[:auction].tc_attach_info, type)
    attachment = UserAttachment.find_by_id(tc_id)
    attachment.nil? '#':attachment.file_path
  end
end