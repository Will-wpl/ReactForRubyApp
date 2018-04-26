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
    table_head, table_row0, table_row1, price_row0, price_row1= [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)'], [], []
    if auction.nil? || auction_result.nil?
      return [table_head, table_row0, table_row1], {visibility_lt: false, visibility_hts: false,
                                                    visibility_htl: false, visibility_eht: false} if visibility

      return [table_head, table_row0, table_row1] unless visibility

    end
    visibility_lt = auction.total_lt_peak > 0 || auction.total_lt_off_peak > 0
    visibility_hts = auction.total_hts_peak > 0 || auction.total_hts_off_peak > 0
    visibility_htl = auction.total_htl_peak > 0 || auction.total_htl_off_peak > 0
    visibility_eht = auction.total_eht_peak > 0 || auction.total_eht_off_peak > 0
    lt_param = {:visibility => visibility_lt, :title => '<b>LT</b>', :peak => auction_result.lt_peak.to_f, :off_peak => auction_result.lt_off_peak.to_f,
                :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :price_row0 => price_row0, :price_row1 => price_row1}
    push_data(lt_param)
    hts_param = {:visibility => visibility_hts, :title => '<b>HT (Small)</b>', :peak => auction_result.hts_peak.to_f, :off_peak => auction_result.hts_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :price_row0 => price_row0, :price_row1 => price_row1}
    push_data(hts_param)
    htl_param = {:visibility => visibility_htl, :title => '<b>HT (Large)</b>', :peak => auction_result.htl_peak.to_f, :off_peak => auction_result.htl_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :price_row0 => price_row0, :price_row1 => price_row1}
    push_data(htl_param)
    eht_param = {:visibility => visibility_eht, :title => '<b>EHT</b>', :peak => auction_result.eht_peak.to_f, :off_peak => auction_result.eht_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :price_row0 => price_row0, :price_row1 => price_row1}
    push_data(eht_param)
    unless visibility && price_data
      return [table_head, table_row0, table_row1]
    end
    return_value = [[table_head, table_row0, table_row1]]
    if visibility
      return_value.push(visibility_lt: visibility_lt, visibility_hts: visibility_hts, visibility_htl: visibility_htl, visibility_eht: visibility_eht)
    end
    return_value.push([price_row0, price_row1]) if price_data
    return_value
  end

  def push_data(param)
    visibility = param[:visibility]
    title = param[:title]
    peak = param[:peak]
    off_peak = param[:off_peak]
    table_head = param[:table_head]
    table_row0 = param[:table_row0]
    table_row1 = param[:table_row1]
    price_row0 = param[:price_row0]
    price_row1 = param[:price_row1]
    if visibility
      table_head.push(title)
      table_row0.push(PdfUtils.get_format_number(peak, '$ ', 4))
      table_row1.push(PdfUtils.get_format_number(off_peak, '$ ', 4))
      price_row0.push(peak)
      price_row1.push(off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end
  end

  def get_period_days(auction)
    period_days = (auction.contract_period_end_date - auction.contract_period_start_date).to_i
    return period_days == 0 ? 1 : period_days + 1
  end

  def get_total_value(total_volume_base, total_volume, total_award_sum_base, total_award_sum)
    return total_volume_base + total_volume, total_award_sum_base + total_award_sum
  end

  def push_consumption_data(param)
    title = param[:title]
    peak = param[:peak]
    off_peak = param[:off_peak]
    table_head = param[:table_head]
    table_row0 = param[:table_row0]
    table_row1 = param[:table_row1]
    row0_data= param[:row0_data]
    row1_data = param[:row1_data]
    table_head.push(title)
    table_row0.push(PdfUtils.number_helper.number_to_currency(peak, precision: 0, unit: ''))
    table_row1.push(PdfUtils.number_helper.number_to_currency(off_peak, precision: 0, unit: ''))
    row0_data.push(peak); row1_data.push(off_peak)
  end


  def get_consumption_table_data(param)
    auction, visibilities, price_data, user_id = param[:auction], param[:visibilities], param[:price_data], param[:user_id]
    table_data = param[:table_data]; table_data = false if table_data.nil?
    current_user_consumption = Consumption.find_by auction_id: auction.id, user_id: user_id
    period_days = get_period_days(auction)
    table_head, table_row0, table_row1, row0_data, row1_data= [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)'], [], []
    total_volume = total_award_sum = 0.0
    # C = (Peak*12/365) * period
    unless current_user_consumption.nil?
      param = {:title => "<b>LT</b>", :current_user_consumption => current_user_consumption,
               :peak => current_user_consumption.lt_peak.to_f, :off_peak => current_user_consumption.lt_off_peak.to_f,
               :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
               :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_lt]
      }
      total_volume, total_award_sum = get_consumption_data(param, 0)
      param = {:title => "<b>HT (Small)</b>", :current_user_consumption => current_user_consumption,
               :peak => current_user_consumption.hts_peak.to_f, :off_peak => current_user_consumption.hts_off_peak.to_f,
               :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
               :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_hts]
      }
      total_volume, total_award_sum = get_consumption_data(param, 1)
      param = {:title => "<b>HT (Large)</b>", :current_user_consumption => current_user_consumption,
               :peak => current_user_consumption.htl_peak.to_f, :off_peak => current_user_consumption.htl_off_peak.to_f,
               :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
               :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_htl]
      }
      total_volume, total_award_sum = get_consumption_data(param, 2)
      param = {:title => "<b>EHT</b>", :current_user_consumption => current_user_consumption,
               :peak => current_user_consumption.eht_peak.to_f, :off_peak => current_user_consumption.eht_off_peak.to_f,
               :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
               :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_eht]
      }
      total_volume, total_award_sum = get_consumption_data(param, 3)
    end
    if table_data
      return [table_head, table_row0, table_row1], [row0_data, row1_data]
    else
      return [table_head, table_row0, table_row1], total_volume, total_award_sum
    end
  end

  private

  def get_consumption_data(param, index)
    current_user_consumption = param[:current_user_consumption]
    period_days = param[:period_days]
    price_data = param[:price_data]
    total_volume = param[:total_volume]
    total_award_sum = param[:total_award_sum]
    visibility = param[:visibility]
    peak = param[:peak]

    if visibility
      push_consumption_data(param)
      value = ((peak * 12.0 / 365.0) * period_days).to_f
      total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][index])
      value = (current_user_consumption.lt_off_peak.to_f * 12.0 / 365.0) * period_days
      get_total_value(total_volume, value, total_award_sum, value * price_data[1][index])
    else
      return total_volume, total_award_sum
    end

  end

end