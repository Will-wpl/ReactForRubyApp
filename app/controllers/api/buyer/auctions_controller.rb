class Api::Buyer::AuctionsController < Api::AuctionsController
  before_action :buyer_required

  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if Arrangement.auction_of_current_user(auction.id, current_user.id).exists?
        render json: { id: auction.id, publish_status: auction.publish_status }, status: 200
      else
        render json: { message: 'you can not get the auction information.' }, status: 400
      end
    end
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      # consumption = Consumption.includes(:auction).where(auctions: { publish_status: '1' }).page(params[:page_index]).per(params[:page_size])
      consumption = Consumption.join_buyer_auction.mine(current_user.id).find_notify_buyer.where(search_where_array).page(params[:page_index]).per(params[:page_size])
      total = consumption.total_count
    else
      consumption = Consumption.mine(current_user.id)
      total = consumption.count
    end
    headers = [
      { name: 'Name', field_name: 'name' },
      { name: 'Date/Time', field_name: 'actual_begin_time' },
      { name: 'Auction Status', field_name: 'publish_status' },
      { name: 'Status of Participation', field_name: 'participation_status' },
      { name: nil, field_name: 'actions' }
    ]
    actions = [{ url: '/buyer/consumptions/:id/edit', name: 'Manage', icon: 'manage', check:'docheck'},
               { url: '/buyer/consumptions/:id/edit', name: 'View', icon: 'view', check:'docheck' }]
    data = []
    consumption.order('auctions.actual_begin_time asc').each do |consumption|
      if (consumption.auction.publish_status == '1') then
        action = 1
      else
        action = consumption.participation_status != '1' ? 0 : 1
      end

      data.push(id: consumption.id, name: consumption.auction.name, actual_begin_time: consumption.auction.actual_begin_time,
                publish_status: consumption.auction.publish_status, participation_status: consumption.participation_status,
                 actions: action)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def pdf
    zone_time = pdf_datetime_zone
    auction_id = params[:id]

    auction = Auction.find_by id:auction_id
    if auction.nil?
      send_no_data_pdf("LETTER", :portrait)
      return
    end
    auction_result = AuctionResult.find_by_auction_id(auction_id)
    price_table_data, visibilities, price_data = get_price_table_data(auction, auction_result, true, true)

    pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
    background_img = Rails.root.join("app","assets", "pdf","bk.png")

    auction_name_date = auction.name + ' on ' + (auction.start_datetime + zone_time).strftime("%d %b %Y")

    consumption_table_data, total_volume, total_award_sum = get_consumption_table_data(auction, visibilities, price_data, current_user.id)
    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             :background => background_img,
                             :page_size => "LETTER",
                             :page_layout => :portrait) do |pdf|
      pdf.fill_color "183243"
      pdf.fill { pdf.rounded_rectangle [-18, pdf.bounds.top+18], pdf.bounds.absolute_right-1, 756, 5}
      pdf.define_grid(:columns => 22, :rows => 35, :gutter => 1)

      # text PDF
      pdf_draw_text_pdf(pdf)

      pdf.grid([4,1],[35,19]).bounding_box do
        #font "consola", :style => :bold_italic, :size => 14
        pdf.font_size(14) { pdf.draw_text "Reverse Auction  #{auction_name_date}.", :at => [pdf.bounds.left, pdf.bounds.top]}
        pdf.move_down 12
        pdf_auction_result_table(pdf, auction, auction_result, total_volume, total_award_sum, 14)
        pdf.move_down 15
        pdf.table([["Price:"]], :cell_style => {:size => 16, :padding => [12,2],
                                                :inline_format => true, :width => pdf.bounds.right, :border_width => 0})
        pdf.move_down 12
        pdf_price_table(pdf, price_table_data)
        pdf.move_down 22
        pdf.table([["Consumption Forecast:"]], :cell_style => {:size => 16, :padding => [12,2],
                                                :inline_format => true, :width => pdf.bounds.right, :border_width => 0})
        pdf.move_down 12
        pdf_consumption_table(pdf, consumption_table_data)
      end
    end
    send_pdf_data(pdf_filename)
  end

  def letter_of_award_pdf
    params[:user_id] = current_user.id
    params[:auction_id] = params[:id]
    super
  end

  private


  def pdf_draw_text_pdf(pdf)
    pdf.fill_color "ffffff"
    pdf.grid([1,1],[1,21]).bounding_box do
      pdf.font_size(32){
        pdf.draw_text "PDF", :at => [pdf.bounds.left, pdf.bounds.top-18]
      }
    end
  end

  def pdf_auction_result_table(pdf, auction,  auction_result, total_volume, total_award_sum, font_size)
    unless auction_result.nil?
      lowest_price_bidder =  auction_result.status == nil ?  auction_result.company_name : auction_result.lowest_price_bidder
    end

    contract_period_start_date = (auction.contract_period_start_date).strftime("%d %b %Y")
    contract_period_end_date = (auction.contract_period_end_date).strftime("%d %b %Y")

    total_volume = number_helper.number_to_currency(total_volume, precision: 0, unit: '')
    total_award_sum = number_helper.number_to_currency(total_award_sum, precision: 2, unit: '$')
    table0_row0, table0_row1, table0_row2, table0_row3 =
        ["Lowest Price Bidder:", lowest_price_bidder],
        ["Contract Period:", "#{contract_period_start_date} to #{contract_period_end_date}"],
        ["Total Volume:", total_volume + " kWh (forecasted)"],
        ["Total Award Sum:", total_award_sum + " (forecasted)"]
    auction_result_table = [table0_row0, table0_row1, table0_row2, table0_row3]

    col0_len = pdf.bounds.right/2-100
    col1_len = pdf.bounds.right - col0_len
    pdf.table(auction_result_table, :column_widths => [col0_len, col1_len],
              :cell_style => {:size => font_size, :padding => [12,2], :inline_format => true, :border_width => 0})
  end

  def pdf_price_table(pdf, price_table_data)
    pdf.table(price_table_data,
              :cell_style => {:size => 12,
                              :align => :center,
                              :valign => :center,
                              :padding => [8,2,14],
                              :inline_format => true,
                              :width => pdf.bounds.right/price_table_data[0].size,
                              :border_width => 0.01,:border_color => "696969"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def pdf_consumption_table(pdf, consumption_table_data)
    pdf.table(consumption_table_data, :cell_style => {:size => 12,
                                                      :align => :center,
                                                      :valign => :center,
                                                      :padding => [8,2,14],
                                                      :inline_format => true,
                                                      :width => pdf.bounds.right/consumption_table_data[0].size,
                                                      :border_width => 0.01,
                                                      :border_color => "696969"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end
end
