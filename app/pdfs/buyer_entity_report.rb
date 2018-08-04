class BuyerEntityReport < BuyerReport

  def pdf
    current_user = param[:current_user]
    auction_result = param[:auction_result]
    auction_contract = param[:auction_contract]
    price_table_data, visibilities, price_hash = get_contract_duration_price(auction_contract, auction_result)
    entities = param[:entities_detail]
    total_consumption = get_consumption_forecast(entities)
    hash = get_entities_date_list(entities)
    entities_data, total_volume, total_award_sum = get_entities_page_data(hash, price_hash)
    param[:total_volume] = total_volume
    param[:total_award_sum] = total_award_sum
    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => background_img,
                             :page_size => "LETTER",
                             :page_layout => :portrait) do |pdf|
      pdf.fill_color "ffffff"
      pdf.define_grid(:columns => 22, :rows => 35, :gutter => 1)
      #main page 1
      pdf.grid([1, 1], [35, 19]).bounding_box do
        pdf_draw_info(pdf, current_user, entities)
        pdf_draw_price(pdf, price_table_data)
        pdf_draw_consumption_forecast(pdf, total_consumption)
      end
      #main page 2
      pdf.start_new_page
      pdf_draw_page2_title(pdf)
      pdf.grid([2, 1], [35, 19]).bounding_box do
        pdf_draw_page2_entities(pdf, hash)
      end
      #entities page
      do_entities_page(pdf, hash, price_table_data, entities_data)
    end
    return pdf_filename, param[:auction].published_gid.to_s + '_BUYER_REPORT.pdf'
  end

  private


  def pdf_draw_page2_title(pdf)
    # pdf.fill_color "ffffff"
    pdf.grid([1, 1], [1, 21]).bounding_box do
      pdf.font_size(16) {
        pdf.draw_text "Breakdown of Consumption Forecast based on Purchasing Entities:", :at => [pdf.bounds.left, pdf.bounds.top-18]
      }
    end
  end

  def pdf_draw_page2_entities(pdf, hash)
    hash.keys.each do |key|
      pdf.move_down 16
      pdf.font_size 16
      pdf.text "#{key}"
      pdf.move_down 6
      table_head, table_row0, table_row1 = [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)']
      hash[key].each {|item|
        table_head.push(PdfUtils::HEAD_STRING_HASH[item[:head]])
        table_row0.push(PdfUtils.number_helper.number_to_currency(item[:peak], precision: 0, unit: ''))
        table_row1.push(PdfUtils.number_helper.number_to_currency(item[:off_peak], precision: 0, unit: ''))
      }
      pdf.table([table_head, table_row0, table_row1],
                :cell_style => {:size => 12,
                                :align => :center,
                                :valign => :center,
                                :padding => [8, 2, 14],
                                :inline_format => true,
                                :width => pdf.bounds.right/table_head.size,
                                :border_width => 0.01, :border_color => "696969"}) do
        values = cells.columns(0..-1).rows(0..0)
        values.background_color = "00394A"
      end
    end
  end

  def get_entities_date_list(entities)
    hash = {}
    entities.each do |entity|
      if hash.has_key?(entity.company_name)
        hash[entity.company_name] = hash[entity.company_name].push({:head => entity.intake_level, :peak => entity.peak, :off_peak => entity.off_peak})
      else
        hash[entity.company_name] = [{:head => entity.intake_level, :peak => entity.peak, :off_peak => entity.off_peak}]
      end
    end
    hash
  end

  def get_entities_page_data(hash, price_hash)
    auction = param[:auction]
    auction_result = param[:auction_result]
    period_days = get_period_days_v2(auction.contract_period_start_date, auction_result.contract_period_end_date)
    value_hash, volume, award_sum = {}, 0.0, 0.0
    hash.keys.each do |key|
      total_volume, total_award_sum = 0.0, 0.0
      hash[key].each {|item|
        prefix = item[:head]
        peak = item[:peak]
        off_peak = item[:off_peak]

        value = ((peak * 12.0 / 365.0) * period_days).to_f
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_hash[prefix+'peak'])
        value = (off_peak * 12.0 / 365.0) * period_days
        total_volume, total_award_sum = get_total_value(total_volume, value, total_award_sum, value * price_hash[prefix+'off_peak'])
      }
      value_hash[key] = {:volume => total_volume, :award_sum => total_award_sum}
      volume += total_volume; award_sum+=total_award_sum
    end
    return value_hash, volume, award_sum
  end

  def do_entities_page(pdf, hash, price_table_data, entities_data)
    hash.keys.each do |key|
      pdf.start_new_page

      pdf.grid([1, 1], [35, 19]).bounding_box do
        pdf_entity_info(pdf, key, entities_data)
        pdf_draw_price(pdf, price_table_data)
        pdf_draw_entity_consumption(pdf, key, hash[key])
      end
    end
  end

  def pdf_draw_entity_consumption(pdf, company_name, hash_value)
    pdf.move_down 22
    pdf.text "#{company_name} Consumption Forecast:"
    pdf.move_down 8

    table_head, table_row0, table_row1 = [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)']
    hash_value.each do |item|
      table_head.push(PdfUtils::HEAD_STRING_HASH[item[:head]])
      table_row0.push(PdfUtils.number_helper.number_to_currency(item[:peak], precision: 0, unit: ''))
      table_row1.push(PdfUtils.number_helper.number_to_currency(item[:off_peak], precision: 0, unit: ''))
    end

    pdf.table([table_head, table_row0, table_row1],
              :cell_style => {:size => 12,
                              :align => :center,
                              :valign => :center,
                              :padding => [8, 2, 14],
                              :inline_format => true,
                              :width => pdf.bounds.right/table_head.size,
                              :border_width => 0.01, :border_color => "696969"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def pdf_entity_info(pdf, entity_company_name, entities_data)
    # pdf.fill_color "ffffff"
    auction = param[:auction]
    auction_result = param[:auction_result]
    contract_period_start_date = get_contract_period_start_date(auction)
    contract_period_end_date = get_contract_period_end_date(auction_result)
    total_volume = entities_data[entity_company_name][:volume]
    total_award_sum = entities_data[entity_company_name][:award_sum]
    total_volume = PdfUtils.number_helper.number_to_currency(total_volume, precision: 0, unit: '')
    total_award_sum = PdfUtils.number_helper.number_to_currency(total_award_sum, precision: 2, unit: '$')
    pdf.font_size(18) {
      pdf_text pdf, "<b>Sub-Report for Purchasing Entity: #{entity_company_name}</b>"
    }
    pdf.move_down 10
    pdf.font_size 14
    pdf_reverse_auction_id(pdf,auction)
    pdf.move_down 10
    pdf_name_of_reverse_auction(pdf, auction)
    pdf.move_down 10
    pdf_datetime_of_auction(pdf, auction)
    pdf.move_down 10
    pdf_winner_bidder(pdf,auction_result)
    pdf.move_down 10
    pdf_text pdf,"<b>Contract Period: </b>" + "#{contract_period_start_date} to #{contract_period_end_date} (#{auction_result.contract_duration} months)"
    pdf.move_down 10
    pdf_text pdf, "<b>#{entity_company_name} Volume: </b>"+ total_volume + " kWh (forecasted)"
    pdf.move_down 10
    pdf_text pdf,"<b>#{entity_company_name} Award Sum: </b>"+total_award_sum + " (forecasted)"
  end

  def pdf_draw_info(pdf, current_user, entities)
    # pdf.fill_color "ffffff"
    auction = param[:auction]
    auction_result = param[:auction_result]
    contract_period_start_date = get_contract_period_start_date(auction)
    contract_period_end_date = get_contract_period_end_date(auction_result)
    total_volume = param[:total_volume]
    total_award_sum = param[:total_award_sum]
    total_volume = PdfUtils.number_helper.number_to_currency(total_volume, precision: 0, unit: '')
    total_award_sum = PdfUtils.number_helper.number_to_currency(total_award_sum, precision: 2, unit: '$')
    pdf.font_size(20) {
      pdf_buyer_company_name(pdf, current_user)
    }
    pdf.font_size 14
    pdf.move_down 8
    pdf_reverse_auction_id(pdf,auction)
    pdf.move_down 8
    pdf_name_of_reverse_auction(pdf, auction)
    pdf.move_down 8
    pdf_datetime_of_auction(pdf, auction)
    pdf.move_down 8
    pdf_winner_bidder(pdf, auction_result)
    pdf.move_down 8
    pdf_text pdf, "<b>Contract Period: </b>" + "#{contract_period_start_date} to #{contract_period_end_date} (#{auction_result.contract_duration} months)"
    pdf.move_down 1
    pdf.table([["<b>Purchasing Entities:</b>", '']] + get_entities_list(entities),
              :cell_style => {:padding => [1, 1], :inline_format => true, :border_width => 0})
    pdf.move_down 8
    pdf_text pdf, "<b>Total Volume: </b>"+ total_volume + " kWh (forecasted)"
    pdf.move_down 8
    pdf_text pdf, "<b>Total Award Sum: </b>"+total_award_sum + " (forecasted)"
  end

  def pdf_buyer_company_name(pdf, current_user)
    pdf_text pdf, "<b>Buyer Report for #{current_user.company_name}</b>"
  end

  def pdf_reverse_auction_id(pdf, auction)
    pdf_text pdf, "<b>Reverse Auction ID: </b>#{auction.published_gid}"
  end

  def pdf_name_of_reverse_auction(pdf, auction)
    pdf_text pdf, "<b>Name of Reverse Auction: </b>#{auction.name}"
  end

  def pdf_datetime_of_auction(pdf, auction)
    zone_time = get_pdf_datetime_zone
    auction_datetime = (auction.start_datetime + zone_time).strftime("%-d %b %Y")
    pdf_text pdf, "<b>Date/Time of Reverse Auction: </b>#{auction_datetime}"
  end

  def pdf_winner_bidder(pdf, auction_result)
    pdf_text pdf, "<b>Winner Bidder:  </b>#{auction_result.lowest_price_bidder}"
  end

  def pdf_text(pdf, text)
    pdf.text text,  :inline_format => true
  end

  def get_entities_list(entities)
    list = []
    entities.each do |entity|
      list.push(['', entity.company_name]) unless list.include?(['', entity.company_name])
    end
    list
  end

  def pdf_draw_price(pdf, price_table_data)
    pdf.move_down 18
    pdf.text "Price:"
    pdf.move_down 8
    pdf.table(price_table_data,
              :cell_style => {:size => 12,
                              :align => :center,
                              :valign => :center,
                              :padding => [8, 2, 14],
                              :inline_format => true,
                              :width => pdf.bounds.right/price_table_data[0].size,
                              :border_width => 0.01, :border_color => "696969"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def pdf_draw_consumption_forecast(pdf, total_consumption)
    pdf.move_down 18
    pdf.text "Total Consumption Forecast:"
    pdf.move_down 8

    table_head, table_row0, table_row1 = [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)']
    total_consumption.keys.each do |key|
      table_head.push(PdfUtils::HEAD_STRING_HASH[key])
      table_row0.push(PdfUtils.number_helper.number_to_currency(total_consumption[key][:peak], precision: 0, unit: ''))
      table_row1.push(PdfUtils.number_helper.number_to_currency(total_consumption[key][:off_peak], precision: 0, unit: ''))
    end

    pdf.table([table_head, table_row0, table_row1],
              :cell_style => {:size => 12,
                              :align => :center,
                              :valign => :center,
                              :padding => [8, 2, 14],
                              :inline_format => true,
                              :width => pdf.bounds.right/table_head.size,
                              :border_width => 0.01, :border_color => "696969"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end

  end

  def get_consumption_forecast(entities)
    hash = {}
    entities.each do |entity|
      if hash.has_key?(entity.intake_level)
        hash[entity.intake_level] = {:peak => hash[entity.intake_level][:peak]+entity.peak, :off_peak => hash[entity.intake_level][:off_peak]+entity.off_peak}
      else
        hash[entity.intake_level] = {:peak => entity.peak, :off_peak => entity.off_peak}
      end
    end
    hash
  end
end