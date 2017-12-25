class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      search_parmas = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_parmas)
      users = User.retailers.where(search_where_array)
                  .page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.retailers
      total = users.count
    end
    headers = []
    actions = []
    headers.push(name: 'Company Name', field_name: 'company_name')
    headers.push(name: 'License Number', field_name: 'company_license_number')
    headers.push(name: 'Status', field_name: 'approval_status')
    data = users.order(approval_status: :desc).each do |user|
      user.approval_status = if user.approval_status == '0'
                               'Rejected'
                             elsif user.approval_status == '2'
                               'Pending'
                             else
                               'Approved'
                             end
    end
    bodies = { data: data, total: total }
    actions.push(url: '/admin/users/:id/manage', name: 'Manage', icon: 'lm--icon-search')
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  # user.user_detail.consumer_type['0', '1'] '0':company '1':individual
  def buyers
    if params.key?(:page_size) && params.key?(:page_index)
      search_parmas = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_parmas)
      users = User.buyers.where(search_where_array)
                  .page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.buyers
      total = users.count
    end
    headers = []
    actions = []
    if params[:consumer_type][0] == '2'
      headers.push(name: 'Company Name', field_name: 'company_name')
    elsif params[:consumer_type][0] == '3'
      headers.push(name: 'Name', field_name: 'name')
    else
      headers.push(name: 'Company Name', field_name: 'company_name')
      headers.push(name: 'Name', field_name: 'name')
    end
    headers.push(name: 'Email', field_name: 'email')
    headers.push(name: 'Consumer Type', field_name: 'consumer_type')
    data = users.order(consumer_type: :desc).each do |user|
      user.consumer_type = user.consumer_type == '2' ? 'Company' : 'Individual'
    end
    bodies = { data: data, total: total }
    actions.push(url: '/admin/users/:id/manage', name: 'View', icon: 'lm--icon-search')
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end
end
