class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending

  def retailers_deleted
    result = get_retailers(params,true)
    render json: result, status: 200
  end

  def retailers
    result = get_retailers(params,false)
    render json: result, status: 200
  end

  def buyers_deleted
    result = get_buyers(params, true)
    render json: result, status: 200
  end

  # user.user_detail.consumer_type['0', '1'] '0':company '1':individual
  def buyers
    result = get_buyers(params, false)
    render json: result, status: 200
  end

  def show
    user = User.find(params[:id])
    render json: user, status: 200
  end

  def show_current_user
    user = current_user
    seller_buyer_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)
    buyer_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)
    seller_revv_tc = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)
    attachments = []
    attachments.push(seller_buyer_tc)
    attachments.push(buyer_revv_tc)
    attachments.push(seller_revv_tc)
    render json: { user: user, attachments: attachments} , status: 200
  end

  def update_attachment_status
    if current_user.has_role?(:retailer)
      current_user.update(agree_seller_buyer: User::AgreeSellerBuyerYes, agree_seller_revv: User::AgreeSellerRevvYes)
    end
    if current_user.has_role?(:buyer)
      current_user.update(agree_seller_buyer: User::AgreeSellerBuyerYes, agree_buyer_revv: User::AgreeBuyerRevvYes)
    end
    render json: current_user, status: 200
  end

  # Remove Retailer
  # Params:
  #   user_id  -> Indicate a user's id
  def remove_retailer
    user_id = params[:user_id]
    remove_user(user_id)
    render json: { result: 'success' }, status: 200
  end

  # Remove Buyer
  # Params:
  #   user_id  -> Indicate a user's id
  def remove_buyer
    user_id = params[:user_id]
    buyer_entities = CompanyBuyerEntity.find_by_user(user_id)
    ActiveRecord::Base.transaction do
      buyer_entities.each do |temp_entity|
        remove_user(temp_entity.user_entity_id) unless temp_entity.user_entity_id.blank?
      end
      buyer_entities.update(is_default: 1, approval_status: CompanyBuyerEntity::ApprovalStatusRemoved)
      remove_user(user_id)
    end
    render json: { result: 'success' }, status: 200
  end


  protected

  def get_buyers(params, is_deleted)
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      if !params[:name].nil? && params[:consumer_type][0] == '2'
        company_name = { company_name: params[:name] }
        search_params = reject_params(search_params, %w[name])
        search_params = search_params.merge(company_name)
      end
      search_where_array = set_search_params(search_params)
      if is_deleted
        users = User.buyers_deleted.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      else
        users = User.buyers.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      end

      total = users.total_count
    else
      users = User.buyers
      total = users.count
    end
    headers = get_buyer_headers(params)
    actions_name = is_deleted ? 'View': 'Manage'
    actions = [{ url: '/admin/users/:id/manage', name: actions_name, icon: 'manage' }]
    data = get_data(params, headers, users)
    data = data.each do |user|
      user.consumer_type = user.consumer_type == '2' ? 'Company' : 'Individual'
      user.approval_status = get_approval_status_string(user)
    end
    bodies = { data: data, total: total }
    result = { headers: headers, bodies: bodies, actions: actions }
    result
  end

  def get_retailers(params, is_deleted)
    if params.key?(:page_size) && params.key?(:page_index)
      search_where_array = get_search_where_array(params)
      if is_deleted
        users = User.retailers_deleted.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      else
        users = User.retailers.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      end
      total = users.total_count
    else
      users = User.retailers
      total = users.count
    end
    headers = [
        { name: 'Company Name', field_name: 'company_name' },
        { name: 'License Number', field_name: 'company_license_number' },
        { name: 'Status', field_name: 'approval_status' }
    ]
    actions_name = is_deleted ? 'View': 'Manage'
    actions = [{ url: '/admin/users/:id/manage', name: actions_name, icon: 'manage' }]
    users = get_retailer_order_list(params, headers, users)
    data = users.each do |user|
      user.approval_status = get_approval_status_string(user)
    end
    bodies = { data: data, total: total }
    result = { headers: headers, bodies: bodies, actions: actions }
    result
  end

  # Remove User
  # Params:
  #   user_id  -> Indicate a user's id
  def remove_user(user_id)
    user = User.find(user_id)
    unless user.blank?
      user.email = string_for_user_value(user.email)
      user.company_unique_entity_number = string_for_user_value(user.company_unique_entity_number)
      user.is_deleted = 1
      user.approval_status = User::ApprovalStatusRemoved
      user.deleted_at = DateTime.current
      user.save!
    end
    user
  end


  # Approval User
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_user
    target_user = User.find(params[:user_id])
    approval_status = params[:approved].blank? ? User::ApprovalStatusReject : User::ApprovalStatusApproved
    comment = params[:comment]
    # unless target_user.approval_status == User::ApprovalStatusApproved
    target_user.update(approval_status: approval_status, comment: comment, approval_date_time: DateTime.current)
    # end

    # if target_user.approval_status == User::ApprovalStatusApproved
    #     if target_user.company_buyer_entities.any?{ |x| x.approval_status == CompanyBuyerEntity::ApprovalStatusPending}
    #         target_user.update(comment: comment, approval_date_time: DateTime.current)
    #     else
    #         target_user.update(approval_status: approval_status, comment: comment, approval_date_time: DateTime.current)
    #     end
    # end

    if approval_status == User::ApprovalStatusApproved
      UserMailer.approval_email(target_user).deliver_later
    elsif approval_status == User::ApprovalStatusReject
      UserMailer.reject_email(target_user).deliver_later
    end
    result_json = {user_base_info: target_user}
    result_json
  end

  private


  def string_for_user_value(val)
    'deleted_' + DateTime.current.strftime('%Y%m%d%H%M').to_s + '_' + val unless val.blank?
  end

  def get_buyer_headers(params)
    headers = [
        { name: 'Company Name', field_name: 'company_name' },
        { name: 'Name', field_name: 'name', table_name: 'users' },
        { name: 'Email', field_name: 'email' },
        { name: 'Consumer Type', field_name: 'consumer_type', is_sort: false },
        { name: 'Status', field_name: 'approval_status' }
    ]
    unless params[:consumer_type].nil?
      headers.delete_if { |header| header[:field_name] == 'name' } if params[:consumer_type][0] == '2'
      headers.delete_if { |header| header[:field_name] == 'company_name' } if params[:consumer_type][0] == '3'
    end
    headers
  end

  def get_retailer_order_list(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(approval_status: :desc, company_name: :asc)
    end
  end

  def get_approval_status_string(user)
    if user.approval_status == '0'
      'Rejected'
    elsif user.approval_status == '1'
      'Approved'
    elsif user.approval_status == '2'
      'Pending'
    elsif user.approval_status == '3'
      'Registering'
    elsif user.approval_status == User::ApprovalStatusDisable
      'Disabled'
    elsif user.approval_status == User::ApprovalStatusRemoved
      'Deleted'
    else
      ''
    end
  end

  def get_default_order(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users
    end
  end

  def get_company_order(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(company_name: :asc)
    end
  end

  def get_individual_order(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(name: :asc)
    end
  end

  def get_data(params, headers, users)
    if params[:consumer_type].nil?
      get_default_order(params, headers, users)
    elsif params[:consumer_type][0] == '2'
      get_company_order(params, headers, users)
    elsif params[:consumer_type][0] == '3'
      get_individual_order(params, headers, users)
    else
      get_default_order(params, headers, users)
    end

  end
end
