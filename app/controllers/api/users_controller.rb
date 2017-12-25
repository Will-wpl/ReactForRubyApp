class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    total = nil
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
    data = users.order(created_at: :desc).each do |user|
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
    headers = []
    actions = []
    headers.push(name: 'Name', index: 1)
    headers.push(name: 'Company Name', index: 5)
    headers.push(name: 'Email', index: 2)
    headers.push(name: 'Consumer Type', index: 7)

    data = User.buyers.order(created_at: :desc).each do |user|
      user.consumer_type = user.consumer_type == '2' ? 'Company' : 'Individual'
    end
    total = data.count
    bodies = { data: data, total: total }
    actions.push(url: '/admin/users/:id/manage', name: 'View', icon: 'lm--icon-search')
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end
end
