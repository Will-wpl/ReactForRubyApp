class Api::Retailer::ArrangementsController < Api::ArrangementsController
  before_action :retailer_required

  # GET arrangement list by auction_id
  # accept_status ['0','1','2'] '0':reject '1':accept '2':pending
  def index
    @arrangements = Arrangement.query_list_by_self(params[:auction_id], params[:accept_status], current_user.id)
    render json: @arrangements, status: 200
  end

end
