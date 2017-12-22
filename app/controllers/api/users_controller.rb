class Api::UsersController < Api::BaseController
  # user.approval_status['0', '1', '2'] '0':rejected '1':approved '2':pending
  def retailers
    headers = []
    actions = []
    headers.push(name: 'Company Name', index: 5)
    headers.push(name: 'License Number', index: 10)
    headers.push(name: 'Status', index: 6)
    data = User.retailers.order(created_at: :desc).each do |user|
      user.approval_status = if user.approval_status == '0'
                               'Rejected'
                             elsif user.approval_status == '2'
                               'Pending'
                             else
                               'Approved'
                             end
    end
    actions.push(url: 'users/:id/manage', name: 'Manage', icon: 'lm--icon-search')
    render json: { headers: headers, data: data, actions: actions }, status: 200
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
    actions.push(url: 'users/:id/manage', name: 'View', icon: 'lm--icon-search')
    render json: { headers: headers, data: data, actions: actions }, status: 200
  end
end
