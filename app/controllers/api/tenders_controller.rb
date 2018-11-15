class Api::TendersController < Api::TendersBaseController

  def current
    workflow = TenderHelper.current(params[:id])
    # workflow = TenderWorkflow.get_arrangement_state_machine(params[:id])
    render json: workflow, status: 200
  end

  def node1_retailer
    auction = @arrangement.auction
    if auction.auction_contracts.blank?
      attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                        .where(file_type: 'retailer_confidentiality_undertaking_upload').order(:created_at)
    else
      if auction.tc_attch_info.blank?
        attachments = [UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC), UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)]
      else
        sbtc_id = Auction.get_tc_attach_info_id(auction.tc_attach_info, UserAttachment::FileType_Seller_Buyer_TC)
        seller_buyer_tc_attachment = UserAttachment.find_by_id(sbtc_id)
        srtc_id = Auction.get_tc_attach_info_id(auction.tc_attach_info, UserAttachment::FileType_Seller_REVV_TC)
        seller_revv_tc_attachment = UserAttachment.find_by_id(srtc_id)
        attachments = [seller_buyer_tc_attachment, seller_revv_tc_attachment]
      end

    end

    render json: attachments, status: 200
  end

  def node2_retailer
    auction = @arrangement.auction
    if auction.auction_contracts.blank?
      aggregate_consumptions = [{ total_lt_peak: auction.total_lt_peak,
                                 total_lt_off_peak: auction.total_lt_off_peak,
                                 total_hts_peak: auction.total_hts_peak,
                                 total_hts_off_peak: auction.total_hts_off_peak,
                                 total_htl_peak: auction.total_htl_peak,
                                 total_htl_off_peak: auction.total_htl_off_peak,
                                 total_eht_peak: auction.total_eht_peak,
                                 total_eht_off_peak: auction.total_eht_off_peak }]
      attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                        .where(file_type: 'tender_documents_upload').order(:created_at)
    else
      aggregate_consumptions = get_lived_auction_contracts(auction, false)
      if auction.tc_attch_info.blank?
        attachments = [UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)]
      else
        sbtc_id = Auction.get_tc_attach_info_id(auction.tc_attach_info, UserAttachment::FileType_Seller_Buyer_TC)
        attachments = [UserAttachment.find_by_id(sbtc_id)]
      end

    end

    render json: { aggregate_consumptions: aggregate_consumptions, attachments: attachments }, status: 200
  end


  def node3_retailer
    auction = @arrangement.auction
    # if auction.auction_contracts.blank?
    seller_buyer_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
    attachments_count = seller_buyer_tc.nil? ? 0 : 1
    chats = set_node3_chats(params[:id])
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id)
                      .where(file_type: 'attachment_deviation').order(:created_at)
    render json: { chats: chats, attachments_count: attachments_count, attachments: attachments }, status: 200
    # else
    #   chats = set_node3_chats(params[:id])
    #   attachments = [UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)]
    #   attachments_count = attachments.count()
    #   render json: { chats: chats, attachments_count: attachments_count, attachments: attachments }, status: 200
    # end
  end

  def node3_admin

    chats = set_node3_chats(params[:id])
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id)
                      .where(file_type: 'attachment_deviation').order(:created_at)
    retailer_id = @arrangement.user_id
    render json: { chats: chats, attachments: attachments, retailer_id: retailer_id }, status: 200
  end

  def node4_retailer
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id).order(:created_at)
    render json: attachments, status: 200
  end

  def node4_admin
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id).order(:created_at)
    chats = set_node3_chats(params[:id])
    comments = @arrangement.comments
    pre_state_machine = TenderStateMachine.find_by_arrangement_id(params[:id]).where(previous_node: 4, current_node: 4, turn_to_role: 2, current_role: 1).last
    render json: { chats: chats, attachments: attachments, comments: comments, pre_state_machine: pre_state_machine }, status: 200
  end

  def node5_retailer
    attachments = []
    @arrangement.auction.auction_attachments.each do |attachment|
      if attachment.file_type == 'birefing_pack_upload'
        attachments.push(attachment)
      end
    end
    render json: attachments, status: 200
  end

  # work flow function
  def node1_retailer_accept
    workflow = TenderHelper.execute(:node1, :accept, params[:id])

    render json: workflow, status: 200
  end

  def node1_retailer_reject
    workflow = TenderHelper.execute(:node1, :reject, params[:id])
    render json: workflow, status: 200
  end

  def node2_retailer_accept_all
    workflow = TenderHelper.execute(:node2, :accept_all, params[:id])
    render json: workflow, status: 200
  end

  def node2_retailer_propose_deviations
    workflow = TenderHelper.execute(:node2, :propose_deviations, params[:id])
    render json: workflow, status: 200
  end

  def node3_retailer_withdraw_all_deviations
    workflow = nil
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      node3_retailer_withdraw_all_deviations_biz(chats, params)
      workflow = TenderHelper.execute(:node3, :withdraw_all_deviations, params[:id])
    end

    render json: workflow, status: 200
  end

  def node3_retailer_submit_deviations
    workflow = nil
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      node3_retailer_submit_deviations_biz(chats, params)
      workflow = TenderHelper.execute(:node3, :submit_deviations, params[:id])
    end
    render json: workflow, status: 200
  end

  def node3_retailer_next
    workflow = TenderHelper.execute(:node3, :next, params[:id])
    render json: workflow, status: 200
  end

  def node3_retailer_back
    node3_retailer_back_biz(params[:id])
    workflow = TenderHelper.execute(:node3, :back, params[:id])
    render json: workflow, status: 200
  end

  def node3_send_response
    workflow = nil
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      chats.each do |chat|
        next if chat['sp_response_status'] == '4'
        tender_chat = TenderChat.find(chat['id'])
        accept_count = TenderChatDetail.admin_response(chat['id']).admin_accept.count
        if accept_count == 0
          chat_info = set_admin_send_response(tender_chat, chat)
          TenderChatDetail.chat_save(tender_chat, chat_info)
        end
      end
      workflow = TenderHelper.execute(:node3, :send_response, params[:id])
    end
    admin_response_mail(params[:id])
    render json: workflow, status: 200
  end

  def node4_retailer_submit
    workflow = TenderHelper.execute(:node4, :submit, params[:id])
    retailer_submit_mail params[:id]
    render json: workflow, status: 200
  end

  def node4_retailer_next
    workflow = TenderHelper.execute(:node4, :next, params[:id])
    render json: workflow, status: 200
  end

  def node4_admin_accept
    workflow = TenderHelper.execute(:node4, :accept, params[:id])
    @arrangement.update(comments: params[:comments])
    admin_accept_mail params[:id]
    render json: workflow, status: 200
  end

  def node4_admin_reject
    workflow = TenderHelper.execute(:node4, :reject, params[:id])
    @arrangement.update(comments: params[:comments])
    admin_reject_mail params[:id], params[:comments]
    render json: workflow, status: 200
  end

  def node5_retailer_submit
    workflow = TenderHelper.execute(:node5, :submit, params[:id])
    render json: workflow, status: 200
  end


  # un-workflow function

  def history
    details = TenderChatDetail.where('tender_chat_id = ?', params[:chat_id]).order(id: :asc)
    company_name = TenderChat.find(params[:chat_id]).arrangement.user.company_name
    details = details.reject do |detail|
      detail.response_status == '2'
    end
    render json: { details: details, retailer_name: company_name }, status: 200
  end

  def node3_retailer_withdraw
    chat = params[:chat]
    tender_chat = TenderChat.admin_find_by_id(chat['id'])
    chat_info = set_withdraw_tender_chat(tender_chat, chat)
    chat = TenderChatDetail.chat_save(tender_chat, chat_info)
    render json: chat, status: 200
  end

  def node3_retailer_back_biz(arrangement_id)
    # delete step3 to step2 at state machines
    TenderStateMachine.where(current_node: 3, arrangement_id: arrangement_id).destroy_all
    # delete step3 chats at tender chats
    TenderChat.where(arrangement_id: arrangement_id).destroy_all
  end

  def node3_retailer_save
    chats = JSON.parse(params[:chats])
    chat_ids = []
    chats.each do |chat|
      chat_ids.push(chat['id']) if chat['id'] != '0'
    end
    tenders = TenderChat.where('arrangement_id = ?', params[:id])
    will_delete_chats = tenders.reject do |tender|
      chat_ids.include?(tender.id.to_s)
    end
    will_delete_chats.each do |chat|
      TenderChat.find(chat.id).destroy
    end
    ActiveRecord::Base.transaction do
      node3_retailer_save_biz(chats, params, chat_ids)
    end
    render json: nil, status: 200
  end

end
