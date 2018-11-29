class Api::RequestAuctionsController < Api::BaseController

  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = RequestAuction.mine(current_user.id).where(search_where_array)
      total = result.count
    else
      result = RequestAuction.mine(current_user.id)
      total = result.count
    end
    result = result.page(params[:page_index]).per(params[:page_size])
    headers = get_request_auction_headers
    data = []
    unless result.blank?
      results = get_order_list(result, params, headers)
      results.each do |result|
        data.push(name: result.name, duration: result.duration,
                  contract_period_start_date: result.contract_period_start_date,
                  buyer_type: (result.buyer_type == RequestAuction::SingleBuyerType)? 'Single':'MultipleBuyerType',
                  allow_deviation: (result.allow_deviation == RequestAuction::AllowDeviation)? 'Yes':'No',
                  total_volume: result.total_volume
                  )
      end
    end

    actions = [
        {url: '/buyer/request_auctions/:id', name: 'Manage', icon: 'edit', interface_type: 'request_auction'}
        # {url: '/buyer/request_auctions/:id', name: 'View', icon: 'view', interface_type: 'request_auction'}
    ]
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def all_request_auction
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = RequestAuction.all.where(search_where_array)
      total = result.count
    else
      result = RequestAuction.all
      total = result.count
    end
    result = result.page(params[:page_index]).per(params[:page_size])
    headers = get_request_auction_headers
    data = []
    unless result.blank?
      results = get_order_list(result, params, headers)
      results.each do |result|
        data.push(name: result.name, duration: result.duration,
                  contract_period_start_date: result.contract_period_start_date,
                  buyer_type: (result.buyer_type == RequestAuction::SingleBuyerType)? 'Single':'MultipleBuyerType',
                  allow_deviation: (result.allow_deviation == RequestAuction::AllowDeviation)? 'Yes':'No',
                  total_volume: result.total_volume
        )
      end
    end

    actions = [
        {url: '/admin/auctions/:id/buyer_dashboard?past', name: 'View', icon: 'view', interface_type: 'request_auction'}
    ]
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def show
    if RequestAuction.where(id: params[:id]).blank?
      # did not find request auction
      render json: { result: 'failure',message: 'Did no find request auction by id.' }, status: 200
    else
      request_auction = RequestAuction.find(params[:id])
      attachments = RequestAttachment.where(request_auction_id: params[:id]).order(:updated_at)
      last_attachment = attachments.last unless attachments.blank?
      render json: { result: 'success', request_auction: request_auction, last_attachment: last_attachment, all_attachments: attachments }, status: 200
    end
  end

  def save_update
    is_update_operation = !params[:id].blank?
    # get all details of the request auction
    request_auction = is_update_operation ? RequestAuction.find( params[:id] ) : RequestAuction.new
    request_auction.name = params[:name] unless params[:name].blank?
    request_auction.contract_period_start_date = params[:contract_period_start_date] unless params[:contract_period_start_date].blank?
    request_auction.duration = params[:duration] unless params[:duration].blank?
    request_auction.buyer_type = params[:buyer_type] unless params[:buyer_type].blank?
    request_auction.allow_deviation = params[:allow_deviation] unless params[:allow_deviation].blank?
    request_auction.total_volume = params[:total_volume] unless params[:total_volume].blank?
    request_auction.user_id = current_user.id
    request_auction.accept_status = RequestAuction::AcceptStatusPending
    # save request auction
    if request_auction.save!
      # save attachment
      attachment_id = params[:attachment_id]
      unless attachment_id.blank?
        attachment = RequestAttachment.find(attachment_id)
        attachment.request_auction_id = request_auction.id
        attachment.save!
      end
    end
    render json: {request_auction: request_auction}, status: 200
  end

  def approval_request_auction
    if RequestAuction.where(id: params[:id]).blank?
      # did not find request auction
      render json: { result: 'failure', message: 'Did no find request auction by id.' }, status: 200
    else
      request_auction = RequestAuction.find(params[:id])
      accept_status = params[:accepted].blank? ? RequestAuction::AcceptStatusReject : RequestAuction::AcceptStatusApproved
      comment = params[:comment]
      request_auction.accept_status = accept_status
      request_auction.comment = comment
      request_auction.save!

      # establish new auction if it is accepted.
      auction = Auction.new
      auction.name = request_auction.name
      auction.contract_period_start_date = request_auction.contract_period_start_date
      auction.buyer_type = request_auction.buyer_type
      auction.duration = request_auction.duration
      auction.allow_deviation = request_auction.allow_deviation
      auction.publish_status = '0'
      auction.total_lt_peak = 0
      auction.total_lt_off_peak = 0
      auction.total_hts_peak = 0
      auction.total_hts_off_peak = 0
      auction.total_htl_peak = 0
      auction.total_htl_off_peak = 0
      auction.total_eht_peak = 0
      auction.total_eht_off_peak = 0
      auction.total_volume = 0
      if auction.save!
        consumption = Consumption.new
        consumption.auction_id = auction.id
        consumption.user_id = request_auction.user_id
        consumption.action_status = Consumption::ActionStatusPending
        consumption.participation_status = Consumption::ParticipationStatusPending
        consumption.save
      end
      render json: { result: 'success', request_auction: request_auction, new_auction_id: auction.id }, status: 200
    end
  end

  def delete_request_auction
    if RequestAuction.where(id: params[:id]).blank?
      # did not find request auction
      render json: { result: 'failure',message: 'Did no find request auction by id.' }, status: 200
    else
    request_auction = RequestAuction.find(params[:id])
      # remove the related request attachments
      RequestAttachment.where(request_auction_id: params[:id]).destroy_all
      request_auction.destroy!

      # removed the request auction
      render json: { result: 'success' }, status: 200
    end
  end

  def buyer_entity_contracts
    unless params[:sort_by].blank?
      sort_by = JSON.parse(params[:sort_by])
      sort_by = "cdf.#{sort_by[0]} #{sort_by[1]}"
    end
    buyer_entity_contracts = RequestAuction.find_buyer_entity_contract_info(current_user.id, sort_by)

    render json: { buyer_entity_contracts: buyer_entity_contracts }, status: 200
  end

  private

  def get_request_auction_headers
    [
        { name: 'Name', field_name: 'name', table_name: 'request_auctions' },
        # { name: 'Contract Duration', field_name: 'duration', table_name: 'request_auctions' },
        { name: 'Start Date', field_name: 'contract_period_start_date', table_name: 'request_auctions' }
        # { name: 'Type', field_name: 'buyer_type', table_name: 'request_auctions' },
        # { name: 'All Deviation', field_name: 'allow_deviation', table_name: 'request_auctions' },
        # { name: 'Total Volume', field_name: 'total_volume', table_name: 'request_auctions' }
    ]
  end

  # def get_buyer_entity_contract_headers
  #   [
  #       { name: 'Purchasing Entity', field_name: 'entity_name', table_name: 'auctions'},
  #       { name: 'Existing Retailer', field_name: 'retailer_name', table_name: 'auctions'},
  #       { name: 'Contract Expiry', field_name: 'contract_expiry', table_name: 'auctions'}
  #   ]
  # end

  def get_order_list(result, params, headers)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      result.order(order_by_string)
    else
      result
    end
  end

  def get_order_by_obj_str(sort_by, headers)
    field_name = sort_by[0]
    order = sort_by[1]
    sort_header = headers.select do |header|
      header[:field_name] == field_name
    end
    unless sort_header.nil?
      order_by_string = sort_header[0][:table_name].nil? ?
                            sort_header[0][:field_name] :
                            "#{sort_header[0][:table_name]}.#{sort_header[0][:field_name]}"
      order_by_string += (order == 'asc') ? ' ASC' : ' DESC'
    end
    order_by_string
  end
end
