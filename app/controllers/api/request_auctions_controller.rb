class Api::RequestAuctionsController < Api::BaseController

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
    request_auction.flexible = params[:flexible] unless params[:flexible].blank?
    request_auction.user_id = current_user.id
    request_auction.comment = "" if request_auction.accept_status == RequestAuction::AcceptStatusReject
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

    User.admins.each do |admin_user|
      UserMailer.request_submitted(admin_user, {buyer_company_name: current_user.company_name}).deliver_later
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
      request_auction.accept_date_time = DateTime.current
      if request_auction.save!
        creater = User.find(request_auction.user_id)
        UserMailer.request_responded(creater).deliver_later
        if accept_status == RequestAuction::AcceptStatusApproved
          if request_auction.buyer_type == RequestAuction::SingleBuyerType
            # establish new auction if it is accepted.
            auction = Auction.new
            auction.name = request_auction.name
            auction.contract_period_start_date = request_auction.contract_period_start_date
            auction.buyer_type = request_auction.buyer_type
            # auction.duration = request_auction.duration
            auction.allow_deviation = request_auction.allow_deviation
            auction.request_auction_id = request_auction.id
            auction.request_owner_id = request_auction.user_id
            auction.accept_status = accept_status
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
              if consumption.save!
                month = request_auction.duration
                contract = AuctionContract.new
                contract.contract_period_end_date = auction.contract_period_start_date.advance(months: month).advance(days: -1)
                contract.contract_duration = month
                contract.auction_id = auction.id
                contract.save
              end
            end
            render json: { result: 'success', request_auction: request_auction, is_single:true, new_auction_id: auction.id }, status: 200
          else
            render json: { result: 'success', request_auction: request_auction, is_single:false }, status: 200
          end
        else
          render json: { result: 'success', request_auction: request_auction }, status: 200
        end
      end
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

  protected

  # def get_request_auction_headers
  #   [
  #       { name: 'Name', field_name: 'name', table_name: 'request_auctions' },
  #       # { name: 'Contract Duration', field_name: 'duration', table_name: 'request_auctions' },
  #       { name: 'Start Date', field_name: 'contract_period_start_date', table_name: 'request_auctions' }
  #       # { name: 'Type', field_name: 'buyer_type', table_name: 'request_auctions' },
  #       # { name: 'All Deviation', field_name: 'allow_deviation', table_name: 'request_auctions' },
  #       # { name: 'Total Volume', field_name: 'total_volume', table_name: 'request_auctions' }
  #   ]
  # end

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
