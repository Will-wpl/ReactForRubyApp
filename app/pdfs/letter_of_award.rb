class LetterOfAward < Pdf
  attr_reader :param, :pdf_template_type, :pdf_filename

  def initialize(param, template_type = 1)
    @param = param
    @pdf_template_type = template_type
    @pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
  end

  def get_template_content
    pdf_template = Rails.root.join('app', 'assets', 'templates', 'letter_of_award_template.html')
    Nokogiri::HTML.parse(open(pdf_template), nil, 'UTF-8')
  end

  def pdf
    auction_result = param[:auction_result]
    return PdfUtils.get_wicked_pdf_data('no data', 'NO_DATA_LETTER_OF_AWARD.pdf') if param[:auction].nil? || auction_result.empty?
    page = get_template_content
    return PdfUtils.get_wicked_pdf_data('no data', 'NO_DATA_LETTER_OF_AWARD.pdf') if page.nil?
    page_content = page.to_s
    page_content = get_content_gsub(param, page_content, page)
    page_content = parse_table1(page, page_content)

    price_table_data, visibilities, price_hash, price_data = get_price_table_data(param.merge({:auction => param[:auction], :auction_result => param[:auction_result][0]}), true, true)
    consumption_table_data, table_data = get_consumption_table_data(param.merge({:auction => param[:auction], :visibilities => visibilities, :price_data => price_data, :user_id => param[:user_id], :table_data => true}))

    page_content = parse_table(page, visibilities, table_data, page_content, '#appendix_table2', 0)
    page_content = parse_extends(page, page_content)
    PdfUtils.get_wicked_pdf_data(page_content, param[:auction].published_gid.to_s + '_LETTER_OF_AWARD.pdf')
  end

  def parse_extends(page, page_content)
    page_content
  end

  def get_content_gsub(param, page_content, page)
    page_content = page_content.gsub(/#retailer_user_company_name/, get_retailer_user_company_name(param))
    page_content = page_content.gsub(/#auction_start_datetime/, get_auction_start_datetime(param))
    page_content = page_content.gsub(/#retailer_company_address/, get_retailer_company_address(param))
    page_content = page_content.gsub(/#auctions_published_gid/, param[:auction].published_gid)
    page_content = page_content.gsub(/#buyer_user_company_name/, get_buyer_user_company_name(param))
    page_content = page_content.gsub(/#buyer_user_company_address/, get_buyer_user_company_address(param))
    page_content = page_content.gsub(/#admin_accept_date/, get_admin_accept_date(param))
    page_content = page_content.gsub(/#auctions_contract_period_start_date/, param[:auction].contract_period_start_date.strftime('%-d %B %Y'))
    page_content = page_content.gsub(/#auctions_contract_period_end_date/, param[:auction_result][0].contract_period_end_date.strftime('%-d %B %Y'))
    page_content = page_content.gsub(/#buyer_uen_number/, get_buyer_uen_number(param))
    page_content = page_content.gsub(/#retailer_uen_number/, get_retailer_uen_number(param))
    page_content = page_content.gsub(/#acknowledge/, get_acknowledge_text(param[:consumption]))
    page_content.gsub(/#total_volume/, PdfUtils.number_helper.number_to_currency(param[:auction_result][0].total_volume.to_f, precision: 0, unit: ''))
  end

  protected

  def parse_table(page, visibilities, table_data, page_content, id_prefix = '#appendix_table2', precision = 0)
    table2_head = html_parse(page, id_prefix+'_head')
    head = html_parse(table2_head, '#lt_head_id', '#hts_head_id', '#htl_head_id', '#eht_head_id')
    table2_tr = html_parse(page, id_prefix+'_peak')
    row0 = html_parse(table2_tr, '#lt_peak_id', '#hts_peak_id', '#htl_peak_id', '#eht_peak_id')
    table2_tr1 = html_parse(page, id_prefix+'_off_peak')
    row1 = html_parse(table2_tr1, '#lt_off_peak_id', '#hts_off_peak_id', '#htl_off_peak_id', '#eht_off_peak_id')
    table2_tr2 = html_parse(page, id_prefix+'_total')
    row2 = html_parse(table2_tr2, '#lt_total_id', '#hts_total_id', '#htl_total_id', '#eht_total_id')
    head_bool, row0_string, row1_string, row2_string = get_table2_row_data({:row0 => row0, :row1 => row1, :row2 => row2, :visibilities => visibilities, :table_data => table_data}, precision)
    table2_head_string, table2_tr0_string, table2_tr1_string, table2_tr2_string =
        get_table_string({:table2_head => table2_head, :table2_tr => table2_tr, :table2_tr1 => table2_tr1, :table2_tr2 => table2_tr2, :head_bool => head_bool, :row0_string => row0_string, :row1_string => row1_string, :row2_string => row2_string, :head => head, :row0 => row0, :row1 => row1, :row2 => row2})

    page_content[table2_head.to_s] = table2_head_string
    page_content[table2_tr.to_s] = table2_tr0_string
    page_content[table2_tr1.to_s] = table2_tr1_string
    page_content[table2_tr2.to_s] = table2_tr2_string
    page_content
  end

  private

  def parse_table1(page, page_content)
    consumption_details = param[:consumption_details]
    table1_tr = html_parse(page, '#appendix_table1_tr')
    tr_string = table1_tr.to_s
    tr_text = get_consumption_details_text(consumption_details, tr_string)
    page_content[tr_string] = tr_text
    page_content
  end

  def get_retailer_user_company_name(param)
    param[:auction_result].empty? ? '' : param[:auction_result][0].company_name
  end

  def get_auction_start_datetime(param)
    (param[:auction].start_datetime + get_pdf_datetime_zone).strftime('%-d %B %Y')
  end

  def get_retailer_company_address(param)
    param[:auction_result].empty? ? '' : param[:auction_result][0].company_address
  end

  def get_buyer_user_company_name(param)
    param[:consumption].empty? ? '' : param[:consumption][0].company_name
  end

  def get_buyer_user_company_address(param)
    param[:consumption].empty? ? '' : param[:consumption][0].company_address
  end

  def get_admin_accept_date(param)
    ((param[:tender_state][0].created_at + get_pdf_datetime_zone).strftime('%-d %B %Y') unless param[:tender_state].empty?).to_s
  end

  def get_buyer_uen_number(param)
    param[:consumption].empty? ? '' : param[:consumption][0].company_unique_entity_number
  end

  def get_retailer_uen_number(param)
    param[:auction_result].empty? ? '' : param[:auction_result][0].company_unique_entity_number
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
                     .gsub(/#premise_address/, get_premise_address(detail))
    end
    tr_text
  end

  def get_premise_address(consumption_detail)
    consumption_detail.premise_address.to_s
  end

  def html_parse(page, *id_name)
    return page.css(id_name[0]) if id_name.length == 1
    elements = []
    for i in 0...id_name.length
      elements.push(page.css(id_name[i]))
    end
    elements
  end

  def get_table2_row_data(param, precision)
    row0 = param[:row0]
    row1 = param[:row1]
    row2 = param[:row2]
    visibilities = param[:visibilities]
    table_data = param[:table_data]
    index = 0
    head_bool, row0_string, row1_string, row2_string = [], [], [], []
    lt_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    lt_param = {:index => index, :lt_total_value => lt_total_value, :visibilities => visibilities[:visibility_lt],
                :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2,
                :total_value => lt_total_value, :var_name1 => '#lt_peak', :var_name2 => '#lt_off_peak', :var_name3 => '#lt_total'}
    idx, headbool, lt_peak, lt_off_peak, lt_total = get_data(0,  lt_param, precision)
    index += idx; head_bool.push(headbool); row0_string.push(lt_peak); row1_string.push(lt_off_peak); row2_string.push(lt_total)
    hts_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    hts_param = {:index => index, :hts_total_value => hts_total_value, :visibilities => visibilities[:visibility_hts],
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2,
                 :total_value => hts_total_value, :var_name1 => '#hts_peak', :var_name2 => '#hts_off_peak', :var_name3 => '#hts_total'}
    idx, headbool, hts_peak, hts_off_peak, hts_total = get_data(1,  hts_param, precision)
    index += idx; head_bool.push(headbool); row0_string.push(hts_peak); row1_string.push(hts_off_peak); row2_string.push(hts_total)
    htl_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    htl_param = {:index => index, :htl_total_value => htl_total_value, :visibilities => visibilities[:visibility_htl],
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2,
                 :total_value => htl_total_value, :var_name1 => '#htl_peak', :var_name2 => '#htl_off_peak', :var_name3 => '#htl_total'}
    idx, headbool, htl_peak, htl_off_peak, htl_total = get_data(2,  htl_param, precision)
    index += idx; head_bool.push(headbool); row0_string.push(htl_peak); row1_string.push(htl_off_peak); row2_string.push(htl_total)
    eht_total_value = table_data[0][index].to_f + table_data[1][index].to_f
    eht_param = {:index => index, :eht_total_value => eht_total_value, :visibilities => visibilities[:visibility_eht],
                 :table_data => table_data, :row0 => row0, :row1 => row1, :row2 => row2,
                 :total_value => eht_total_value, :var_name1 => '#eht_peak', :var_name2 => '#eht_off_peak', :var_name3 => '#eht_total'}
    idx, headbool, eht_peak, eht_off_peak, eht_total = get_data(3,  eht_param, precision)
    index += idx; head_bool.push(headbool); row0_string.push(eht_peak); row1_string.push(eht_off_peak); row2_string.push(eht_total)
    return head_bool, row0_string, row1_string, row2_string
  end


  def get_data(position, param, precision = 0)
    total_value = param[:total_value]
    var_name1 = param[:var_name1]
    var_name2 = param[:var_name2]
    var_name3 = param[:var_name3]

    if param[:visibilities] && total_value != 0.0
      peak = param[:row0][position].to_s.gsub(Regexp.new(var_name1), PdfUtils.number_helper.number_to_currency(param[:table_data][0][param[:index]], precision: precision, unit: ''))
      off_peak = param[:row1][position].to_s.gsub(Regexp.new(var_name2), PdfUtils.number_helper.number_to_currency(param[:table_data][1][param[:index]], precision: precision, unit: ''))
      total = param[:row2][position].to_s.gsub(Regexp.new(var_name3), PdfUtils.number_helper.number_to_currency(total_value, precision: precision, unit: ''))
      return 1, true, peak, off_peak, total
    else
      idx = 0
      idx = 1 if total_value == 0.0
      return idx, false, '', '', ''
    end
  end


end