class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
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
    users = if params.key?(:sort_by)
              order_by_string = get_order_by_string(params[:sort_by])
              users.order(order_by_string)
            else
              users.order(approval_status: :desc, company_name: :asc)
            end
    data = users.each do |user|
      user.approval_status = if user.approval_status == '0'
                               'Rejected'
                             elsif user.approval_status == '1'
                               'Approved'
                             elsif user.approval_status == '2'
                               'Pending'
                             else
                               ''
                             end
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
    headers = [
      { name: 'Company Name', field_name: 'company_name' },
      { name: 'Name', field_name: 'name', table_name: 'users' },
      { name: 'Email', field_name: 'email' },
      { name: 'Consumer Type', field_name: 'consumer_type', is_sort: false }
    ]
    actions = [{ url: '/admin/users/:id/manage', name: 'View', icon: 'view' }]
    unless params[:consumer_type].nil?
      headers.delete_if { |header| header[:field_name] == 'name' } if params[:consumer_type][0] == '2'
      headers.delete_if { |header| header[:field_name] == 'company_name' } if params[:consumer_type][0] == '3'
    end
    data = if params[:consumer_type].nil?
             if params.key?(:sort_by)
               order_by_string = get_order_by_string(params[:sort_by])
               users.order(order_by_string)
             else
               users
             end
           elsif params[:consumer_type][0] == '2'
             if params.key?(:sort_by)
               order_by_string = get_order_by_string(params[:sort_by])
               users.order(order_by_string)
             else
               users.order(company_name: :asc)
             end
           elsif params[:consumer_type][0] == '3'
             if params.key?(:sort_by)
               order_by_string = get_order_by_string(params[:sort_by])
               users.order(order_by_string)
             else
               users.order(name: :asc)
             end
           else
             if params.key?(:sort_by)
               order_by_string = get_order_by_string(params[:sort_by])
               users.order(order_by_string)
             else
               users
             end
           end
    data = data.each do |user|
      user.consumer_type = user.consumer_type == '2' ? 'Company' : 'Individual'
    end
    bodies = { data: data, total: total }

    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def show
    user = User.find(params[:id])
    render json: user, status: 200
  end
end
