class Api::Buyer::AuctionsController < Api::AuctionsController
  before_action :buyer_required

  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if Arrangement.auction_of_current_user(auction.id, current_user.id).exists?
        render json: { id: auction.id, publish_status: auction.publish_status }, status: 200
      elsif current_user.id == auction.request_owner_id
        render json: { id: auction.id, publish_status: auction.publish_status, name: auction.name }, status: 200
      elsif Consumption.find_by_auction_and_user(auction.id, current_user.id).exists?
        render json: { id: auction.id, publish_status: auction.publish_status, name: auction.name  }, status: 200
      else
        render json: { message: 'you can not get the auction information.' }, status: 400
      end
    end
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      # consumption = Consumption.includes(:auction).where(auctions: { publish_status: '1' }).page(params[:page_index]).per(params[:page_size])
      consumption = Consumption.find_buyer_result_auction.mine(current_user.id).find_notify_buyer.where(search_where_array).page(params[:page_index]).per(params[:page_size])
      total = consumption.total_count
    else
      consumption = Consumption.mine(current_user.id)
      total = consumption.count
    end
    headers = [
      { name: 'Name', field_name: 'name', table_name: 'auctions' },
      { name: 'Auction Date/Time', field_name: 'actual_begin_time', table_name: 'auctions' },
      { name: 'Auction Status', field_name: 'publish_status', table_name: 'auctions' },
      { name: 'Status of Participation', field_name: 'participation_status', table_name: 'consumptions' },
      { name: 'Status of Approval', field_name: 'accept_status', table_name: 'consumptions' },
      { name: nil, field_name: 'actions', is_sort: false }
    ]
    actions = [{ url: '/buyer/consumptions/:id/edit', name: 'Manage', icon: 'manage', check: 'docheck' },
               { url: '/buyer/consumptions/:id/edit', name: 'View', icon: 'view', check: 'docheck' },
               { url: '/buyer/auctions/:id/retailer_dashboard', name: 'Retailer Dashboard', icon: 'edit', interface_type: 'auction'}]
    data = []
    consumptions = get_order_list(params, headers, consumption)
    consumptions.each do |consumption|
      action = get_action(consumption)
      data.push(id: consumption.id, name: consumption.auction.name, actual_begin_time: consumption.auction.actual_begin_time,
                publish_status: consumption.auction.publish_status, participation_status: consumption.participation_status,
                accept_status: get_accept_status(consumption.accept_status),
                actions: action, dashdoard_id: consumption.auction.request_auction_id, auction_id: consumption.auction.id,
                show_dashboard: consumption.auction.buyer_type == Auction::SingleBuyerType && consumption.auction.allow_deviation == Auction::NotAllowDeviation ? false : true
                )
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def pdf
    auction_id = params[:id]
    auction = Auction.find_by id: auction_id

    if auction.nil?
      pdf_filename, output_filename = PdfUtils.get_no_data_pdf("LETTER", :portrait, 'NO_DATA_BUYER_REPORT.pdf')
    else
      current_user_consumption = Consumption.find_by auction_id: auction.id, user_id: current_user.id
      if current_user_consumption.contract_duration.nil?
        auction_result = AuctionResult.find_by(auction_id: auction_id)

        pdf_filename, output_filename = BuyerReport.new({
                                                            :auction => auction,
                                                            :auction_result => auction_result,
                                                            :current_user => current_user
                                                        }).pdf
      elsif current_user_consumption.accept_status != Consumption::AcceptStatusApproved
        pdf_filename, output_filename = PdfUtils.get_no_data_pdf("LETTER", :portrait, 'NO_DATA_BUYER_REPORT.pdf')
      else
        auction_result = AuctionResultContract.find_by auction_id: auction.id, contract_duration: current_user_consumption.contract_duration, status: AuctionResultContract::STATUS_WIN
        auction_contract = AuctionContract.find_by auction_id: auction.id, contract_duration: current_user_consumption.contract_duration
        entities_detail = get_entities_detail(current_user_consumption.id)
        pdf_filename, output_filename = BuyerEntityReport.new({
                                                                  :entities_detail => entities_detail,
                                                                  :current_user_consumption => current_user_consumption,
                                                                  :auction_result => auction_result,
                                                                  :auction => auction,
                                                                  :current_user => current_user,
                                                                  :auction_contract => auction_contract
                                                              }).pdf
      end

    end

    send_data IO.read(Rails.root.join(pdf_filename)), filename: output_filename
    File.delete Rails.root.join(pdf_filename)
  end

  def letter_of_award_pdf
    params[:user_id] = current_user.id
    params[:auction_id] = params[:id]
    super
  end

  private

  def get_accept_status(accept_status)
    case accept_status
      when "0"
        accept_status_str = 'Admin Rejected'
      when "1"
        accept_status_str = 'Admin Approved'
      when "2"
        accept_status_str = 'Pending Approval'
      else
        accept_status_str = ''
    end
    accept_status_str
  end

  def get_order_list(params, headers, consumption)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      consumption.order(order_by_string)
    else
      consumption.order('auctions.actual_begin_time asc')
     end
  end

  def get_action(consumption)
    if consumption.auction.publish_status == '1' then
      1
    else
      consumption.participation_status != '1' ? 0 : 1
    end
  end

  def get_entities_detail(consumption_id)
    ConsumptionDetail.find_by_sql ['SELECT 	cbe."id",	intake_level,	SUM ( peak ) peak,	SUM ( off_peak ) off_peak,	cbe.company_name
                                         FROM	consumption_details cds
	                                       LEFT JOIN company_buyer_entities cbe
                                           ON cds.company_buyer_entity_id = cbe."id"
                                        WHERE	cds.consumption_id = ?
                                     GROUP BY cbe."id", intake_level, cbe.company_name
                                     ORDER BY intake_level desc', consumption_id]
  end
end
