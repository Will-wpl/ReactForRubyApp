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
    consumption_details.each {|item|
      if item.intake_level === intake_level
        return item.peak, item.off_peak
      end
    }
    return 0.0, 0.0
  end

  def get_premise_address(consumption_detail)
    blk_or_unit = consumption_detail.blk_or_unit
    street = consumption_detail.street
    unit_number = consumption_detail.unit_number
    postal_code = consumption_detail.postal_code
    "#{blk_or_unit} #{street} #{unit_number} #{postal_code}"
  end

end