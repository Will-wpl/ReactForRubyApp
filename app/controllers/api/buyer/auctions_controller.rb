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
    price_table, visibilities = get_price_table_data(auction, auction_result, true)

    pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
    background_img = Rails.root.join("app","assets", "pdf","bk.png")

    auction_name_date = auction.name + " on " + (auction.start_datetime + zone_time).strftime("%d %b %Y")
    unless auction_result.nil?
      lowest_price_bidder =  auction_result.status == nil ?  auction_result.company_name : auction_result.lowest_price_bidder
    end

    contract_period_start_date = (auction.contract_period_start_date).strftime("%d %b %Y")
    contract_period_end_date = (auction.contract_period_end_date).strftime("%d %b %Y")

    contract_period = (auction.contract_period_end_date - auction.contract_period_start_date).to_i
    contract_period = contract_period == 0 ? 1 : contract_period + 1

    current_user_consumption = Consumption.find_by auction_id:auction_id, user_id:current_user.id

    unless current_user_consumption.nil?

    end

    Prawn::Document.generate(pdf_filename,
                             :background => background_img,
                             :page_size => "LETTER",
                             :page_layout => :portrait) do
      fill_color "183243"
      fill { rounded_rectangle [-18, bounds.top+18], bounds.absolute_right-1, 756, 15}
      define_grid(:columns => 22, :rows => 35, :gutter => 1)

      fill_color "ffffff"

      grid([1,1],[1,21]).bounding_box do
        font_size(32){
          draw_text "PDF", :at => [bounds.left, bounds.top-18]
        }

      end

      table0_row0, table0_row1, table0_row2, table0_row3 =
          ["Lowest Price Bidder:", lowest_price_bidder],["Contract Period:", "#{contract_period_start_date} to #{contract_period_end_date}"],["Total Volume:"],["Total Award Sum:"]
      auction_result_table = [table0_row0, table0_row1, table0_row2, table0_row3]

      price_title = [["Price:"]]

      consumption_title = [["Consumption Forecast :"]]
      consumption_table = [["", "LT", "HT(Small)", "HT(Large)", "EHT(Large)"],["Peak(7am-7pm)","$ 0.0999"],["Off-Peak(7am-7pm)"*6, "$ 0.0999"]]

      grid([4,1],[35,19]).bounding_box do
        #font "consola", :style => :bold_italic, :size => 14
        font_size(16) { draw_text "Reverse Auction #{auction_name_date}.", :at => [bounds.left, bounds.top]}

        move_down 12
        #:width => bounds.right/2,  :height => 36, :overflow => :shrink_to_fit,
        col0_len = bounds.right/2-70
        col1_len = bounds.right - col0_len

        table(auction_result_table, :column_widths => [col0_len, col1_len], :cell_style => {:size => 16, :padding => [12,2], :inline_format => true, :border_width => 0})
        move_down 15
        table(price_title, :cell_style => {:size => 16, :padding => [12,2], :inline_format => true, :width => bounds.right, :border_width => 0})
        move_down 12
        table(price_table, :cell_style => {:size => 12, :align => :center, :valign => :center, :padding => [8,2,14], :inline_format => true, :width => bounds.right/price_table[0].size,  :border_width => 0.01,:border_color => "696969"}) do
          values = cells.columns(0..-1).rows(0..0)
          values.background_color = "00394A"
          #values = cells.columns(0..-1).rows(is_bidder_index..is_bidder_index)
          #values.background_color = "228B22"
        end

        move_down 22
        table(consumption_title, :cell_style => {:size => 16, :padding => [12,2], :inline_format => true, :width => bounds.right, :border_width => 0})
        move_down 12
        table(consumption_table, :cell_style => {:size => 12, :align => :center, :valign => :center, :padding => [8,2,14], :inline_format => true, :width => bounds.right/5,  :border_width => 0.01,:border_color => "696969"}) do
          values = cells.columns(0..-1).rows(0..0)
          values.background_color = "00394A"
          #values = cells.columns(0..-1).rows(is_bidder_index..is_bidder_index)
          #values.background_color = "228B22"
        end
      end
      #grid.show_all
      #fill_color "193344"
      #fill {rectangle [50, bounds.top-50], bounds.absolute_right-185, 530}
    end
    send_pdf_data(pdf_filename)
  end
end
