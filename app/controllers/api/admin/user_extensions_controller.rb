class Api::Admin::UserExtensionsController < Api::BaseController
  before_action :admin_required
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action])
      search_where_array = set_search_params(search_params)
      ue = UserExtension.retailers.where(search_where_array)
                            .page(params[:page_index]).per(params[:page_size])
      total = ue.total_count
    else
      ue = UserExtension.all
      total = ue.count
    end

    headers = [
      { name: 'Company Name', field_name: 'company_name', table_name: 'users' },
      { name: 'Login Status', field_name: 'logged_in_status', table_name: 'user_extensions' },
      { name: 'Last Login', field_name: 'logged_in_last_time', table_name: 'user_extensions' },
      { name: 'Live Connectivity', field_name: 'ws_send_message_status', table_name: 'user_extensions' },
      { name: 'Last Live Connection', field_name: 'ws_send_message_last_time', table_name: 'user_extensions' },
      { name: 'Last Login IP', field_name: 'current_ip', table_name: 'user_extensions' },
    ]
    data = []
    ue = if params.key?(:sort_by)
           order_by_string = get_order_by_string(params[:sort_by])
           ue.order(order_by_string)
         else
           ue.order(created_at: :desc)
         end
    ue.each do |ue|
      data.push(company_name: ue.user.company_name, logged_in_status: ue.logged_in_status,
                logged_in_last_time: ue.logged_in_last_time, ws_connected_status: ue.ws_connected_status,
                ws_connected_last_time: ue.ws_connected_last_time, ws_send_message_status: ue.ws_send_message_status,
                ws_send_message_last_time: ue.ws_send_message_last_time, current_ip: ue.current_ip)
    end

    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end
end
