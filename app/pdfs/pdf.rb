class Pdf

  def get_pdf_datetime_zone
    zone = 8
    (zone * 60 * 60)
  end

  def datetime_millisecond(datetime, flag = 1)
    unless datetime.index('.').nil?
      datetime[datetime.index('.'), 6] = flag == 1 ? '.' + '9' * 6 + 'Z' : '.' + '0' * 6 + 'Z'
    else
      datetime['Z'] = flag == 1 ? '.' + '9' * 6 + 'Z' : '.' + '0' * 6 + 'Z'
    end
    datetime
  end

  def get_price_table_data(auction, auction_result, visibility = false, price_data = false)
    table_head = ['']
    table_row0 = ['Peak<br/>(7am-7pm)']
    table_row1 = ['Off-Peak<br/>(7pm-7am)']
    price_row0 = []
    price_row1 = []
    if auction.nil? || auction_result.nil?
      if visibility
        return [table_head, table_row0, table_row1], {visibility_lt: false, visibility_hts: false,
                                                      visibility_htl: false, visibility_eht: false}
      else
        return [table_head, table_row0, table_row1]
      end
    end
    visibility_lt = auction.total_lt_peak > 0 || auction.total_lt_off_peak > 0
    visibility_hts = auction.total_hts_peak > 0 || auction.total_hts_off_peak > 0
    visibility_htl = auction.total_htl_peak > 0 || auction.total_htl_off_peak > 0
    visibility_eht = auction.total_eht_peak > 0 || auction.total_eht_off_peak > 0

    if visibility_lt
      table_head.push('<b>LT</b>')

      table_row0.push(PdfUtils.get_format_number(auction_result.lt_peak.to_f, '$ ', 4))
      table_row1.push(PdfUtils.get_format_number(auction_result.lt_off_peak.to_f, '$ ', 4))
      price_row0.push(auction_result.lt_peak)
      price_row1.push(auction_result.lt_off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end

    if visibility_hts
      table_head.push('<b>HT (Small)</b>')
      table_row0.push(PdfUtils.get_format_number(auction_result.hts_peak.to_f, '$ ', 4))
      table_row1.push(PdfUtils.get_format_number(auction_result.hts_off_peak.to_f, '$ ', 4))
      price_row0.push(auction_result.hts_peak)
      price_row1.push(auction_result.hts_off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end

    if visibility_htl
      table_head.push('<b>HT (Large)</b>')
      table_row0.push(PdfUtils.get_format_number(auction_result.htl_peak.to_f, '$ ', 4))
      table_row1.push(PdfUtils.get_format_number(auction_result.htl_off_peak.to_f, '$ ', 4))
      price_row0.push(auction_result.htl_peak)
      price_row1.push(auction_result.htl_off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end

    if visibility_eht
      table_head.push('<b>EHT</b>')
      table_row0.push(PdfUtils.get_format_number(auction_result.eht_peak.to_f, '$ ', 4))
      table_row1.push(PdfUtils.get_format_number(auction_result.eht_off_peak.to_f, '$ ', 4))
      price_row0.push(auction_result.eht_peak)
      price_row1.push(auction_result.eht_off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end

    unless visibility && price_data
      return [table_head,
              table_row0,
              table_row1]
    end
    return_value = [[table_head,
                     table_row0,
                     table_row1]]

    if visibility
      return_value.push(visibility_lt: visibility_lt,
                        visibility_hts: visibility_hts,
                        visibility_htl: visibility_htl,
                        visibility_eht: visibility_eht)
    end
    return_value.push([price_row0, price_row1]) if price_data
    return_value
  end

  def get_period_days(auction)
    period_days = (auction.contract_period_end_date - auction.contract_period_start_date).to_i
    return period_days == 0 ? 1 : period_days + 1
  end

  def get_total_value(total_volume_base, total_volume, total_award_sum_base, total_award_sum)
    return total_volume_base + total_volume, total_award_sum_base + total_award_sum
  end

  def get_consumption_table_data(param)
    auction = param[:auction]
    visibilities = param[:visibilities]
    price_data = param[:price_data]
    user_id = param[:user_id]
    table_data = param[:table_data]
    table_data = false if table_data.nil?

    current_user_consumption = Consumption.find_by auction_id: auction.id, user_id: user_id
    period_days = get_period_days(auction)

    table_head = ['']
    table_row0 = ['Peak<br/>(7am-7pm)']
    table_row1 = ['Off-Peak<br/>(7pm-7am)']
    row0_data = []
    row1_data = []
    total_volume = 0.0
    total_award_sum = 0.0
    # C = (Peak*12/365) * period
    unless current_user_consumption.nil?
      if visibilities[:visibility_lt]
        table_head.push("<b>LT</b>")
        table_row0.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.lt_peak.to_f, precision: 0, unit: ''))
        table_row1.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.lt_off_peak.to_f, precision: 0, unit: ''))
        row0_data.push(current_user_consumption.lt_peak.to_f); row1_data.push(current_user_consumption.lt_off_peak.to_f)
        value = ((current_user_consumption.lt_peak.to_f * 12.0 / 365.0) * period_days).to_f
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][0])

        value = (current_user_consumption.lt_off_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[1][0])
      end
      if visibilities[:visibility_hts]
        table_head.push("<b>HT (Small)</b>")
        table_row0.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.hts_peak.to_f, precision: 0, unit: ''))
        table_row1.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.hts_off_peak.to_f, precision: 0, unit: ''))
        row0_data.push(current_user_consumption.hts_peak.to_f); row1_data.push(current_user_consumption.hts_off_peak.to_f)
        value = (current_user_consumption.hts_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][1])

        value = (current_user_consumption.hts_off_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[1][1])
      end
      if visibilities[:visibility_htl]
        table_head.push("<b>HT (Large)</b>")
        table_row0.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.htl_peak.to_f, precision: 0, unit: ''))
        table_row1.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.htl_off_peak.to_f, precision: 0, unit: ''))
        row0_data.push(current_user_consumption.htl_peak.to_f); row1_data.push(current_user_consumption.htl_off_peak.to_f)
        value = (current_user_consumption.htl_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][2])

        value = (current_user_consumption.htl_off_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[1][2])
      end
      if visibilities[:visibility_eht]
        table_head.push("<b>EHT</b>")
        table_row0.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.eht_peak.to_f, precision: 0, unit: ''))
        table_row1.push(PdfUtils.number_helper.number_to_currency(current_user_consumption.eht_off_peak.to_f, precision: 0, unit: ''))
        row0_data.push(current_user_consumption.eht_peak.to_f); row1_data.push(current_user_consumption.eht_off_peak.to_f)
        value = (current_user_consumption.eht_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][3])

        value = (current_user_consumption.eht_off_peak.to_f * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[1][3])
      end
    end
    if table_data
      return [table_head, table_row0, table_row1], [row0_data, row1_data]
    else
      return [table_head, table_row0, table_row1], total_volume, total_award_sum
    end
  end


end