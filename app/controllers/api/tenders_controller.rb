class Api::TendersController < Api::BaseController

  def current
    workflow = TenderWorkflow.new.get_arrangement_state_machine(params[:id])
    render json: workflow, status: 200
  end

  def node1_retailer
    attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                                   .where(file_type: 'retailer_confidentiality_undertaking_upload')
    render json: attachments, status: 200
  end

  def node2_retailer
    auction = @arrangement.auction
    aggregate_consumptions = { total_lt_peak: auction.total_lt_peak,
                               total_lt_off_peak: auction.total_lt_off_peak,
                               total_hts_peak: auction.total_hts_peak,
                               total_hts_off_peak: auction.total_hts_off_peak,
                               total_htl_peak: auction.total_htl_peak,
                               total_htl_off_peak: auction.total_htl_off_peak,
                               total_eht_peak: auction.total_eht_peak,
                               total_eht_off_peak: auction.total_eht_off_peak }
    attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                                   .where(file_type: 'tender_documents_upload')
    render json: { aggregate_consumptions: aggregate_consumptions, attachments: attachments }, status: 200
  end

  def node3_retailer
    attachments_count = AuctionAttachment.belong_auction(@arrangement.auction_id)
                      .where(file_type: 'tender_documents_upload').count
    chats = []
    TenderChat.where(arrangement_id: params[:id]).each do |chat|
      last_retailer_response = TenderChatDetail.last_retailer_response(chat.id)
      last_sp_response = TenderChatDetail.last_admin_response(chat.id)
      chats.push(item: chat.item, clause: chat.clause, sp_response_status: chat.sp_response_status,
                 retailer_response: last_retailer_response.retailer_response, propose_deviation: last_retailer_response.propose_deviation,
                 sp_response: last_sp_response.sp_response)
    end

    render json: { chats: chats, attachments_count: attachments_count }, status: 200
  end

  def node4_retailer
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id)
    render json: attachments, status: 200
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
    workflow = TenderWorkflow.new.execute(:node1, :accept, params[:id])

    render json: workflow, status: 200
  end

  def node1_retailer_reject
    workflow = TenderWorkflow.new.execute(:node1, :reject, params[:id])
    render json: workflow, status: 200
  end

  def node2_retailer_accept_all
    workflow = TenderWorkflow.new.execute(:node2, :accept_all, params[:id])
    render json: workflow, status: 200
  end

  def node2_retailer_propose_deviations
    workflow = TenderWorkflow.new.execute(:node2, :propose_deviations, params[:id])
    render json: workflow, status: 200
  end

  def node3_retailer_withdraw_all_deviations
    workflow = nil
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      chats.each do |chat|
        tender_chat = set_tender_chat(chat, params[:id])
        next unless tender_chat.save
        chat_info = set_withdraw_tender_chat(tender_chat, chat)
        TenderChatDetail.chat_save(chat_info)
      end

      workflow = TenderWorkflow.new.execute(:node3, :withdraw_all_deviations, params[:id])
    end

    render json: workflow, status: 200
  end

  def node3_retailer_submit_deviations
    workflow = nil
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      chats.each do |chat|
        tender_chat = set_tender_chat(chat, params[:id])
        next unless tender_chat.save
        chat_info = set_submit_deviation_tender_chat(tender_chat, chat)
        TenderChatDetail.chat_save(chat_info)
      end

      workflow = TenderWorkflow.new.execute(:node3, :submit_deviations, params[:id])
    end
    render json: workflow, status: 200
  end

  def node3_retailer_next
    workflow = TenderWorkflow.new.execute(:node3, :next, params[:id])
    render json: workflow, status: 200
  end

  def node3_send_response
    workflow = TenderWorkflow.new.execute(:node3, :send_response, params[:id])
    render json: workflow, status: 200
  end

  def node4_retailer_submit
    workflow = TenderWorkflow.new.execute(:node4, :submit, params[:id])
    render json: workflow, status: 200
  end

  def node4_retailer_next
    workflow = TenderWorkflow.new.execute(:node4, :next, params[:id])
    render json: workflow, status: 200
  end

  def node4_admin_accept
    workflow = TenderWorkflow.new.execute(:node4, :accept, params[:id])
    render json: workflow, status: 200
  end

  def node4_admin_reject
    workflow = TenderWorkflow.new.execute(:node4, :reject, params[:id])
    render json: workflow, status: 200
  end

  def node5_retailer_submit
    workflow = TenderWorkflow.new.execute(:node5, :submit, params[:id])
    render json: workflow, status: 200
  end


  # un-workflow function

  def history
    details = TenderChat.find(params[:chat_id]).tender_chat_details
    render json: details, status: 200
  end

  def node3_retailer_withdraw
    chat = params[:chat]
    tender_chat = TenderChat.find(params[:chat_id])
    chat_info = set_withdraw_tender_chat(tender_chat, chat)
    chat = TenderChatDetail.chat_save(chat_info)
    render json: chat, status: 200
  end

  def node3_retailer_save
    chats = JSON.parse(params[:chats])
    ActiveRecord::Base.transaction do
      chats.each do |chat|
        tender_chat = set_tender_chat(chat, params[:id])
        next unless tender_chat.save
        chat_info = set_save_tender_chat(tender_chat, chat)
        TenderChatDetail.chat_save(chat_info)
      end
    end

    render json: nil, status: 200
  end

  def node3_admin_accept; end

  def node3_admin_reject; end

  private

  def set_arrangement
    @arrangement = Arrangement.find(params[:id])
  end

  def set_tender_chat(chat, arrangement_id)
    if chat.id == 0 || chat.id.nil?
      tender_chat = TenderChat.new
      tender_chat.item = chat.item
      tender_chat.clause = chat.clause
      tender_chat.arrangement_id = arrangement_id
    else
      tender_chat = TenderChat.find(chat.id)
      tender_chat.item = chat.item
      tender_chat.clause = chat.clause
    end
    tender_chat
  end

  def set_withdraw_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat.propose_deviation
    chat_info.retailer_response = 'I have withdrawn this deviation.'
    chat_info.sp_response = nil
    chat_info.response_status = '1'
    chat_info.sp_response_status = '0'
    chat_info
  end

  def set_save_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat.propose_deviation
    chat_info.retailer_response = chat.retailer_response
    chat_info.sp_response = nil
    chat_info.response_status = '2'
    chat_info.sp_response_status = '2'
    chat_info
  end

  def set_submit_deviation_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat.propose_deviation
    chat_info.retailer_response = chat.retailer_response
    chat_info.sp_response = nil
    chat_info.response_status = '3'
    chat_info.sp_response_status = '1'
    chat_info
  end
end
