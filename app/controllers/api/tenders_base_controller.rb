class Api::TendersBaseController < Api::BaseController

  protected

  def set_arrangement
    @arrangement = if current_user.has_role?('admin')
                     Arrangement.admin_find_by_id(params[:id])
                   elsif current_user.has_role?('buyer') && Arrangement.find(params[:id]).auction.request_owner_id == current_user.id
                     Arrangement.admin_find_by_id(params[:id])
                   else
                     current_user.arrangements.find(params[:id])
                   end

  end

  def get_arrangement_user(arrangement_id)
    return if arrangement_id.empty?
    this_arrangement = Arrangement.find_by id:arrangement_id
    return if this_arrangement.nil?
    User.find(this_arrangement.user_id)
  end

  def retailer_submit_mail(arrangement_id)
    user = get_arrangement_user(arrangement_id)
    return if user.nil?
    User.admins.each do |admin_user|
      UserMailer.retailer_submit_mail(admin_user, user).deliver_later
    end

  end

  def admin_accept_mail(arrangement_id)
    user = get_arrangement_user(arrangement_id)
    return if user.nil?
    UserMailer.workflow_admin_accept_mail(user).deliver_later
  end

  def admin_reject_mail(arrangement_id, comments)
    user = get_arrangement_user(arrangement_id)
    return if user.nil?
    UserMailer.workflow_admin_reject_mail(user, comments).deliver_later
  end

  def admin_response_mail(arrangement_id)
    user = get_arrangement_user(arrangement_id)
    return if user.nil?
    name = if current_user&.has_role?(:admin)
             'Admin'
           else
             current_user.company_name
           end
    UserMailer.workflow_admin_response_mail(user, name).deliver_later
  end
  
  def set_tender_chat(chat, arrangement_id)
    if chat['id'] == '0' || chat['id'].nil?
      tender_chat = TenderChat.new
      tender_chat.item = chat['item']
      tender_chat.clause = chat['clause']
      tender_chat.arrangement_id = arrangement_id
    else
      tender_chat = TenderChat.find(chat['id'])
      tender_chat.item = chat['item']
      tender_chat.clause = chat['clause']
    end
    tender_chat
  end

  def set_withdraw_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat['propose_deviation']
    chat_info.retailer_response = 'I have withdrawn this deviation.'
    chat_info.sp_response = nil
    chat_info.response_status = '4'
    chat_info.sp_response_status = '4'
    chat_info
  end

  def set_save_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat['propose_deviation']
    chat_info.retailer_response = chat['retailer_response']
    chat_info.sp_response = nil
    chat_info.response_status = '2'
    chat_info.sp_response_status = chat['sp_response_status']
    chat_info
  end

  def set_submit_deviation_tender_chat(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.propose_deviation = chat['propose_deviation']
    chat_info.retailer_response = chat['retailer_response']
    chat_info.sp_response = nil
    chat_info.response_status = '3'
    chat_info.sp_response_status = chat['sp_response_status']
    chat_info
  end

  def set_admin_send_response(tender_chat, chat)
    chat_info = ChatInfoDto.new(tender_chat)
    chat_info.sp_response = chat['sp_response']
    chat_info.sp_response_status = chat['sp_response_status']
    chat_info.response_status = chat['sp_response_status']
    chat_info
  end

  def set_node3_chats(arrangement_id)
    chats = []
    TenderChat.where(arrangement_id: arrangement_id).order(id: :asc).each do |chat|
      last_retailer_response = TenderChatDetail.retailer_response(chat.id).last
      last_sp_response = TenderChatDetail.admin_response(chat.id).last
      chats.push(id: chat.id, item: chat.item, clause: chat.clause, sp_response_status: chat.sp_response_status,
                 retailer_response: get_retailer_response_value(last_retailer_response),
                 propose_deviation: get_propose_deviation_value(last_retailer_response),
                 sp_response: get_sp_response_value(last_sp_response),
                 response_status: get_response_status_values(last_retailer_response, last_sp_response))
    end
    chats
  end

  def get_retailer_response_value(last_retailer_response)
    last_retailer_response.nil? ? nil : last_retailer_response.retailer_response
  end

  def get_propose_deviation_value(last_retailer_response)
    last_retailer_response.nil? ? nil : last_retailer_response.propose_deviation
  end

  def get_sp_response_value(last_sp_response)
    last_sp_response.nil? ? nil : last_sp_response.sp_response
  end

  def get_response_status_values(last_retailer_response, last_sp_response)
    [last_retailer_response.nil? ? nil : last_retailer_response.response_status,
     last_sp_response.nil? ? nil : last_sp_response.response_status]
  end

  def node3_retailer_submit_deviations_biz(chats, params)
    chats.each do |chat|
      next if chat['sp_response_status'] == '4' || chat['sp_response_status'] == '1'
      tender_chat = set_tender_chat(chat, params[:id])
      next unless tender_chat.save!
      chat_info = set_submit_deviation_tender_chat(tender_chat, chat)
      TenderChatDetail.chat_save(tender_chat, chat_info)
    end
  end

  def node3_retailer_withdraw_all_deviations_biz(chats, params)
    chats.each do |chat|
      next if chat['sp_response_status'] == '4' || chat['sp_response_status'] == '2'
      tender_chat = set_tender_chat(chat, params[:id])
      next unless tender_chat.save!
      chat_info = set_withdraw_tender_chat(tender_chat, chat)
      TenderChatDetail.chat_save(tender_chat, chat_info)
    end
  end

  def node3_retailer_save_biz(chats, params, chat_ids)
    chats.each do |chat|
      chat_ids.push(chat['id']) if chat['id'] != '0'
      tender_chat = set_tender_chat(chat, params[:id])
      next unless tender_chat.save!
      chat_info = set_save_tender_chat(tender_chat, chat)
      TenderChatDetail.chat_save(tender_chat, chat_info)
    end
  end
end
