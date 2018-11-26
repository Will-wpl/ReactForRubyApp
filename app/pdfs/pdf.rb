class Pdf

  FONT_COLOR = '000000'.freeze

  def get_pdf_datetime_zone
    zone = 8
    (zone * 60 * 60)
  end

  def get_price_table_data(param, visibility = false, price_data = false)
    auction, auction_result = param[:auction], param[:auction_result]
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
    hts_param = {:visibility => visibility_hts, :title => '<b>HTS</b>', :peak => auction_result.hts_peak.to_f, :off_peak => auction_result.hts_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :price_row0 => price_row0, :price_row1 => price_row1}
    push_data(hts_param)
    htl_param = {:visibility => visibility_htl, :title => '<b>HTL</b>', :peak => auction_result.htl_peak.to_f, :off_peak => auction_result.htl_off_peak.to_f,
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

      table_row0.push(PdfUtils.number_helper.number_to_currency(peak, precision: 4, format: '$ %n/kWh'))
      table_row1.push(PdfUtils.number_helper.number_to_currency(off_peak, precision: 4, format: '$ %n/kWh'))
      price_row0.push(peak)
      price_row1.push(off_peak)
    else
      price_row0.push(0.0)
      price_row1.push(0.0)
    end
  end

  def push_data_v2(param)
    visibility = param[:visibility]
    title = param[:title]
    prefix = param[:prefix]
    price_hash = param[:price_hash]
    peak = param[:peak]
    off_peak = param[:off_peak]
    table_head = param[:table_head]
    table_row0 = param[:table_row0]
    table_row1 = param[:table_row1]
    if visibility
      table_head.push(title)
      table_row0.push(PdfUtils.number_helper.number_to_currency(peak, precision: 4, format: '%n'))
      table_row1.push(PdfUtils.number_helper.number_to_currency(off_peak, precision: 4, format: '%n'))
      price_hash[prefix+'peak'] = peak
      price_hash[prefix+'off_peak'] = off_peak
    else
      price_hash[prefix+'peak'] = 0
      price_hash[prefix+'off_peak'] = 0
    end
  end

  def get_period_days(auction)
    period_days = (auction.contract_period_end_date - auction.contract_period_start_date).to_i
    return period_days == 0 ? 1 : period_days + 1
  end

  def get_period_days_v2(period_start_date, period_end_date)
    period_days = (period_end_date - period_start_date).to_i
    period_days == 0 ? 1 : period_days + 1
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
      total_volume, total_award_sum = get_consumption_data({:peak => current_user_consumption.lt_peak.to_f, :off_peak => current_user_consumption.lt_off_peak.to_f,
                                                            :title => "<b>LT</b>", :current_user_consumption => current_user_consumption,
                                                            :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
                                                            :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_lt]
                                                           }, 0)

      total_volume, total_award_sum = get_consumption_data({:title => "<b>HTS</b>", :current_user_consumption => current_user_consumption,
                                                            :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
                                                            :peak => current_user_consumption.hts_peak.to_f, :off_peak => current_user_consumption.hts_off_peak.to_f,
                                                            :period_days => period_days, :price_data => price_data, :total_volume => total_volume, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_hts]
                                                           }, 1)
      total_volume, total_award_sum = get_consumption_data({:title => "<b>HTL</b>", :current_user_consumption => current_user_consumption,
                                                            :peak => current_user_consumption.htl_peak.to_f, :off_peak => current_user_consumption.htl_off_peak.to_f,
                                                            :table_head => table_head, :price_data => price_data, :total_volume => total_volume, :row0_data => row0_data, :row1_data => row1_data,
                                                            :period_days => period_days, :table_row0 => table_row0, :table_row1 => table_row1, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_htl]
                                                           }, 2)

      total_volume, total_award_sum = get_consumption_data({:title => "<b>EHT</b>", :current_user_consumption => current_user_consumption, :total_award_sum => total_award_sum, :visibility => visibilities[:visibility_eht],
                                                            :peak => current_user_consumption.eht_peak.to_f, :off_peak => current_user_consumption.eht_off_peak.to_f,
                                                            :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :row0_data => row0_data, :row1_data => row1_data,
                                                            :period_days => period_days, :price_data => price_data, :total_volume => total_volume,
                                                           }, 3)
    end
    if table_data
      return [table_head, table_row0, table_row1], [row0_data, row1_data]
    else
      return [table_head, table_row0, table_row1], total_volume, total_award_sum
    end
  end


  protected

  def get_contract_period_start_date(auction)
    (auction.contract_period_start_date).strftime("%-d %b %Y")
  end

  def get_contract_period_end_date(auction_result)
    (auction_result.contract_period_end_date).strftime("%-d %b %Y")
  end


  def get_contract_duration_price(auction_contract, auction_result)
    table_head, table_row0, table_row1, price_hash = [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)'], {}
    visibility_lt = auction_contract.total_lt_peak > 0 || auction_contract.total_lt_off_peak > 0
    visibility_hts = auction_contract.total_hts_peak > 0 || auction_contract.total_hts_off_peak > 0
    visibility_htl = auction_contract.total_htl_peak > 0 || auction_contract.total_htl_off_peak > 0
    visibility_eht = auction_contract.total_eht_peak > 0 || auction_contract.total_eht_off_peak > 0

    lt_param = {:visibility => visibility_lt, :title => '<b>LT<br/>($/kWh)</b>', :peak => auction_result.lt_peak.to_f, :off_peak => auction_result.lt_off_peak.to_f,
                :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :prefix => 'LT', :price_hash => price_hash}
    push_data_v2(lt_param)
    hts_param = {:visibility => visibility_hts, :title => '<b>HTS<br/>($/kWh)</b>', :peak => auction_result.hts_peak.to_f, :off_peak => auction_result.hts_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :prefix => 'HTS', :price_hash => price_hash}
    push_data_v2(hts_param)
    htl_param = {:visibility => visibility_htl, :title => '<b>HTL<br/>($/kWh)</b>', :peak => auction_result.htl_peak.to_f, :off_peak => auction_result.htl_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :prefix => 'HTL', :price_hash => price_hash}
    push_data_v2(htl_param)
    eht_param = {:visibility => visibility_eht, :title => '<b>EHT<br/>($/kWh)</b>', :peak => auction_result.eht_peak.to_f, :off_peak => auction_result.eht_off_peak.to_f,
                 :table_head => table_head, :table_row0 => table_row0, :table_row1 => table_row1, :prefix => 'EHT', :price_hash => price_hash}
    push_data_v2(eht_param)

    return_value = [[table_head, table_row0, table_row1]]
    return_value.push(visibility_lt: visibility_lt, visibility_hts: visibility_hts, visibility_htl: visibility_htl, visibility_eht: visibility_eht)
    return_value.push(price_hash)
    return_value
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
    off_peak = param[:off_peak]
    if visibility
      push_consumption_data(param)
      value = ((peak * 12.0 / 365.0) * period_days).to_f
      total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_data[0][index])
      value = (off_peak * 12.0 / 365.0) * period_days
      get_total_value(total_volume, value, total_award_sum, value * price_data[1][index])
    else
      return total_volume, total_award_sum
    end

  end

end