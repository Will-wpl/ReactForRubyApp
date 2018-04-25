class LetterOfAward < Pdf
  attr_reader :param, :pdf_template, :pdf_filename

  def initialize(param)
    @param = param
    @pdf_template = Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html')
    @pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
  end

  def pdf
    auction_result = param[:auction_result]
    consumption_details = param[:consumption_details]
    return PdfUtils.get_wicked_pdf_data('no data', 'NO_DATA_LETTER_OF_AWARD.pdf') if param[:auction].nil?
    return PdfUtils.get_wicked_pdf_data('no data', 'NO_DATA_LETTER_OF_AWARD.pdf') if auction_result.empty?
    page = Nokogiri::HTML.parse(open(pdf_template), nil, 'UTF-8')
    table1_tr = html_parse(page, '#appendix_table1_tr')
    tr_string = table1_tr.to_s
    tr_text = get_consumption_details_text(consumption_details, tr_string)
    price_table_data, visibilities, price_data = get_price_table_data(param[:auction], auction_result[0], true, true)
    consumption_table_data, table_data = get_consumption_table_data({:auction => param[:auction], :visibilities => visibilities, :price_data => price_data, :user_id => param[:user_id], :table_data => true})
    table2_head = html_parse(page, '#appendix_table2_head')
    head = html_parse(table2_head, '#lt_head_id', '#hts_head_id', '#htl_head_id', '#eht_head_id')
    table2_tr = html_parse(page, '#appendix_table2_peak')
    row0 = html_parse(table2_tr, '#lt_peak_id', '#hts_peak_id', '#htl_peak_id', '#eht_peak_id')
    table2_tr1 = html_parse(page, '#appendix_table2_off_peak')
    row1 = html_parse(table2_tr1, '#lt_off_peak_id', '#hts_off_peak_id', '#htl_off_peak_id', '#eht_off_peak_id')
    table2_tr2 = html_parse(page, '#appendix_table2_total')
    row2 = html_parse(table2_tr2, '#lt_total_id', '#hts_total_id', '#htl_total_id', '#eht_total_id')
    head_bool, row0_string, row1_string, row2_string = get_table2_row_data({:head => head, :row0 => row0, :row1 => row1, :row2 => row2, :visibilities => visibilities, :table_data => table_data})
    table2_head_string, table2_tr0_string, table2_tr1_string, table2_tr2_string =
        get_table_string({:table2_head => table2_head, :table2_tr => table2_tr, :table2_tr1 => table2_tr1, :table2_tr2 => table2_tr2, :head_bool => head_bool, :row0_string => row0_string, :row1_string => row1_string, :row2_string => row2_string, :head => head, :row0 => row0, :row1 => row1, :row2 => row2})

    page_content = get_content_gsub(param, page.to_s)
    page_content[tr_string] = tr_text
    page_content[table2_head.to_s] = table2_head_string
    page_content[table2_tr.to_s] = table2_tr0_string
    page_content[table2_tr1.to_s] = table2_tr1_string
    page_content[table2_tr2.to_s] = table2_tr2_string
    PdfUtils.get_wicked_pdf_data(page_content, param[:auction].published_gid.to_s + '_LETTER_OF_AWARD.pdf')
  end

  private

  def get_content_gsub(param, page_content)
    page_content = page_content.gsub(/#retailer_user_company_name/, param[:auction_result].empty? ? '' : param[:auction_result][0].company_name)
    page_content = page_content.gsub(/#auction_start_datetime/, (param[:auction].start_datetime + get_pdf_datetime_zone).strftime('%-d %B %Y'))
    page_content = page_content.gsub(/#retailer_company_address/, param[:auction_result].empty? ? '' : param[:auction_result][0].company_address)
    page_content = page_content.gsub(/#auctions_published_gid/, param[:auction].published_gid)
    page_content = page_content.gsub(/#buyer_user_company_name/, param[:consumption].empty? ? '' : param[:consumption][0].company_name)
    page_content = page_content.gsub(/#admin_accept_date/, ((param[:tender_state][0].created_at + get_pdf_datetime_zone).strftime('%-d %B %Y') unless param[:tender_state].empty?).to_s)
    page_content = page_content.gsub(/#auctions_contract_period_start_date/, param[:auction].contract_period_start_date.strftime('%-d %B %Y'))
    page_content = page_content.gsub(/#buyer_uen_number/, param[:consumption].empty? ? '' : param[:consumption][0].company_unique_entity_number)
    page_content = page_content.gsub(/#retailer_uen_number/, param[:auction_result].empty? ? '' : param[:auction_result][0].company_unique_entity_number)
    page_content = page_content.gsub(/#acknowledge/, get_acknowledge_text(param[:consumption]))
  end

  def get_table_string(param)
    table2_head_string = param[:table2_head].to_s
    table2_tr0_string = param[:table2_tr].to_s
    table2_tr1_string = param[:table2_tr1].to_s
    table2_tr2_string = param[:table2_tr2].to_s
    for i in 0...param[:head_bool].length
      table2_head_string[(param[:head])[i].to_s] = '' unless param[:head_bool][i]
      table2_tr0_string[(param[:row0])[i].to_s] = (param[:row0_string])[i]
      table2_tr1_string[(param[:row1])[i].to_s] = (param[:row1_string])[i]
      table2_tr2_string[(param[:row2])[i].to_s] = (param[:row2_string])[i]
    end
    return table2_head_string, table2_tr0_string, table2_tr1_string, table2_tr2_string
  end


  def get_acknowledge_text(consumption)
    if consumption.empty?
      'Pending'
    else
      consumption[0].acknowledge.nil? ? 'Pending' : 'Acknowledged'
    end
  end

  def get_consumption_details_text(consumption_details, tr_string)
    tr_text = ''
    consumption_details.each do |detail|
      tr_text += tr_string
                     .gsub(/#account_number/, detail.account_number.to_s)
                     .gsub(/#intake_level/, detail.intake_level.to_s)
                     .gsub(/#peak_volume/, PdfUtils.number_helper.number_to_currency(detail.peak.to_f, precision: 0, unit: ''))
                     .gsub(/#off_peak_volume/, PdfUtils.number_helper.number_to_currency(detail.off_peak.to_f, precision: 0, unit: ''))
                     .gsub(/#contracted_capacity/, (
                     if detail.contracted_capacity.nil?
                       '---'
                     else
                       PdfUtils.number_helper.number_to_currency(detail.contracted_capacity.to_f, precision: 0, unit: '')
                     end))
                     .gsub(/#premise_address/, detail.premise_address.to_s)
    end
    tr_text
  end

  def html_parse(page, *id_name)
    return page.css(id_name[0]) if id_name.length == 1
    elements = []
    for i in 0...id_name.length
      elements.push(page.css(id_name[i]))
    end
    elements
  end

  def get_table2_row_data(param)
    head = param[:head]
    row0 = param[:row0]
    row1 = param[:row1]
    row2 = param[:row2]
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    index = 0
    head_bool, row0_string, row1_string, row2_string = [], [], [], []
    lt_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    lt_param = {:index => index, :lt_total_value => lt_total_value, :visibilities => visibilities,
                :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2}
    idx, headbool, lt_peak, lt_off_peak, lt_total = get_lt_data(lt_param)
    index += idx; head_bool.push(headbool); row0_string.push(lt_peak); row1_string.push(lt_off_peak); row2_string.push(lt_total)
    hts_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    hts_param = {:index => index, :hts_total_value => hts_total_value, :visibilities => visibilities,
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2}
    idx, headbool, hts_peak, hts_off_peak, hts_total = get_hts_data(hts_param)
    index += idx; head_bool.push(headbool); row0_string.push(hts_peak); row1_string.push(hts_off_peak); row2_string.push(hts_total)
    htl_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    htl_param = {:index => index, :htl_total_value => htl_total_value, :visibilities => visibilities,
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2}
    idx, headbool, htl_peak, htl_off_peak, htl_total = get_htl_data(htl_param)
    index += idx; head_bool.push(headbool); row0_string.push(htl_peak); row1_string.push(htl_off_peak); row2_string.push(htl_total)
    eht_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    eht_param = {:index => index, :eht_total_value => eht_total_value, :visibilities => visibilities,
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2}
    idx, headbool, eht_peak, eht_off_peak, eht_total = get_eht_data(eht_param)
    index += idx; head_bool.push(headbool); row0_string.push(eht_peak); row1_string.push(eht_off_peak); row2_string.push(eht_total)
    return head_bool, row0_string, row1_string, row2_string
  end

  def get_lt_data(param)
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    row0, row1, row2 = param[:row0], param[:row1], param[:row2]
    lt_total_value = param[:lt_total_value]
    index = param[:index]

    if visibilities[:visibility_lt] && lt_total_value != 0.0
      lt_peak = row0[0].to_s.gsub(/#lt_peak/, PdfUtils.number_helper.number_to_currency(table_data[0][index], precision: 0, unit: ''))
      lt_off_peak = row1[0].to_s.gsub(/#lt_off_peak/, PdfUtils.number_helper.number_to_currency(table_data[1][index], precision: 0, unit: ''))
      lt_total = row2[0].to_s.gsub(/#lt_total/, PdfUtils.number_helper.number_to_currency(lt_total_value, precision: 0, unit: ''))
      return 1, true, lt_peak, lt_off_peak, lt_total
    else
      idx = 0
      idx = 1 if lt_total_value == 0.0
      return idx, false, '', '', ''
    end
  end

  def get_hts_data(param)
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    row0, row1, row2 = param[:row0], param[:row1], param[:row2]
    hts_total_value = param[:hts_total_value]
    index = param[:index]
    if visibilities[:visibility_hts] && hts_total_value != 0.0
      hts_peak = row0[1].to_s.gsub(/#hts_peak/, PdfUtils.number_helper.number_to_currency(table_data[0][index], precision: 0, unit: ''))
      hts_off_peak = row1[1].to_s.gsub(/#hts_off_peak/, PdfUtils.number_helper.number_to_currency(table_data[1][index], precision: 0, unit: ''))
      hts_total = row2[1].to_s.gsub(/#hts_total/, PdfUtils.number_helper.number_to_currency(hts_total_value, precision: 0, unit: ''))
      return 1, true, (hts_peak), (hts_off_peak), (hts_total)
    else
      idx = 0
      idx += 1 if hts_total_value == 0.0
      return idx, false, '', '', ''
    end
  end

  def get_htl_data(param)
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    row0, row1, row2 = param[:row0], param[:row1], param[:row2]
    htl_total_value = param[:htl_total_value]
    index = param[:index]
    if visibilities[:visibility_htl] && htl_total_value != 0.0
      htl_peak = row0[2].to_s.gsub(/#htl_peak/, PdfUtils.number_helper.number_to_currency(table_data[0][index], precision: 0, unit: ''))
      htl_off_peak = row1[2].to_s.gsub(/#htl_off_peak/, PdfUtils.number_helper.number_to_currency(table_data[1][index], precision: 0, unit: ''))
      htl_total = row2[2].to_s.gsub(/#htl_total/, PdfUtils.number_helper.number_to_currency(htl_total_value, precision: 0, unit: ''))
      return 1, true, htl_peak, htl_off_peak, htl_total
    else
      idx = 0
      idx += 1 if htl_total_value == 0.0
      return idx, false, '', '', ''
    end
  end

  def get_eht_data(param)
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    row0, row1, row2 = param[:row0], param[:row1], param[:row2]
    eht_total_value = param[:eht_total_value]
    index = param[:index]
    if visibilities[:visibility_eht] && eht_total_value != 0.0
      eht_peak = row0[3].to_s.gsub(/#eht_peak/, PdfUtils.number_helper.number_to_currency(table_data[0][index], precision: 0, unit: ''))
      eht_off_peak = row1[3].to_s.gsub(/#eht_off_peak/, PdfUtils.number_helper.number_to_currency(table_data[1][index], precision: 0, unit: ''))
      eht_total = row2[3].to_s.gsub(/#eht_total/, PdfUtils.number_helper.number_to_currency(eht_total_value, precision: 0, unit: ''))
      return 1, true, eht_peak, eht_off_peak, eht_total
    else
      idx = 0
      idx += 1 if eht_total_value == 0.0
      return idx, false, '', '', ''
    end
  end
end