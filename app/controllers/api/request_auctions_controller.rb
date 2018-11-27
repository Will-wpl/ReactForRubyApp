class Api::RequestAuctionsController < Api::BaseController

  def index
    my_request_auctions = RequestAuction.mine(current_user.id)
    render json: { request_auctions: my_request_auctions }, status: 200
  end

  def request_auctions_pending
    my_request_auctions = RequestAuction.find_pending
    render json: { request_auctions: my_request_auctions }, status: 200

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
    request_auction.user_id = current_user.id
    request_auction.accept_status = RequestAuction::AcceptStatusPending
    # save request auction
    if request_auction.save!
      # save attachment
      file = params[:file]
      unless file.blank?
        uploader = upload_file
        attachment = RequestAttachment.new
        attachment.file_name = file.original_filename #filename
        attachment.file_type = params[:file_type]
        attachment.file_path = uploader.url
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
      # comment = params[:comment]
      request_auction.accept_status = accept_status
      # request_auction.comment = comment
      # request_auction.approval_date_time = DateTime.current
      request_auction.save!

      render json: { result: 'success', request_auction: request_auction }, status: 200
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
    unless params[:sort_by].nil?
      sort_by = JSON.parse(params[:sort_by])
      sort_by = "cdf.#{sort_by[0]} #{sort_by[1]}"
    end
    buyer_entity_contracts = RequestAuction.find_buyer_entity_contract_info(current_user.id, sort_by)

    render json: { buyer_entity_contracts: buyer_entity_contracts }, status: 200
  end

  private
  def upload_file
    file = params[:file]
    mounted_as = []
    mounted_as.push(current_user.id.to_s) unless current_user&.has_role?(:admin)
    mounted_as.push(Time.current.to_f.to_s.delete('.'))

    uploader = AvatarUploader.new(RequestAttachment, mounted_as)
    uploader.store!(file)
    uploader
  end
end
