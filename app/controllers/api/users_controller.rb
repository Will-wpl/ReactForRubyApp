class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      search_where_array = get_search_where_array(params)
      users = User.retailers.where(search_where_array)
                  .page(params[:page_index]).per(params[:page_size])
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
    actions = [{ url: '/admin/users/:id/manage', name: 'Manage', icon: 'manage' }]
    users = get_retailer_order_list(params, headers, users)
    data = users.each do |user|
      user.approval_status = get_approval_status_string(user)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  # user.user_detail.consumer_type['0', '1'] '0':company '1':individual
  def buyers
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      if !params[:name].nil? && params[:consumer_type][0] == '2'
        company_name = { company_name: params[:name] }
        search_params = reject_params(search_params, %w[name])
        search_params = search_params.merge(company_name)
      end
      search_where_array = set_search_params(search_params)
      users = User.buyers.where(search_where_array)
                  .page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.buyers
      total = users.count
    end
    headers = get_buyer_headers(params)
    actions = [{ url: '/admin/users/:id/manage', name: 'Manage', icon: 'manage' }]
    data = get_data(params, headers, users)
    data = data.each do |user|
      user.consumer_type = user.consumer_type == '2' ? 'Company' : 'Individual'
      user.approval_status = get_approval_status_string(user)
    end
    bodies = { data: data, total: total }

    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def show
    user = User.find(params[:id])
    render json: user, status: 200
  end

  protected

  # Approval User
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_user
    target_user = User.find(params[:user_id])
    approval_status = params[:approved].blank? ? User::ApprovalStatusReject : User::ApprovalStatusApproved
    comment = params[:comment]
    unless target_user.approval_status == User::ApprovalStatusApproved
      target_user.update(approval_status: approval_status, comment: comment)
    end

    if target_user.approval_status == User::ApprovalStatusApproved
        if target_user.company_buyer_entities.any?{ |x| x.approval_status == CompanyBuyerEntity::ApprovalStatusPending}
            target_user.update(comment: comment, approval_date_time: DateTime.current)
        else
            target_user.update(approval_status: approval_status, comment: comment, approval_date_time: DateTime.current)
        end
    end

    if approval_status == User::ApprovalStatusApproved
      UserMailer.approval_email(target_user).deliver_later
    elsif approval_status == User::ApprovalStatusReject
      UserMailer.reject_email(target_user).deliver_later
    end
    result_json = {user_base_info: target_user}
    result_json
  end

  private

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
