class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end
end
