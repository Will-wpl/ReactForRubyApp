class Api::AuctionsController < ApplicationController
  before_action :set_auction, only: [:update, :publish]

  # GET auction info by ajax
  def obtain
    if Auction.count == 0
      render json: nil
    else
      @auction = Auction.first
      render json: @auction, status: 200
    end
  end

  # GET manage route link by ajax
  def link
    @auction = Auction.first
    if @auction.publish_status != '1'
      render json: { url: '/admin/auctions/empty' }, status: 200
    elsif @auction.publish_status == '1' and Time.now < @auction.actual_begin_time
      link = set_link(@auction.id, 'upcoming')
      render json: { url: link }, status: 200
    elsif @auction.publish_status == '1' and @auction.actual_begin_time < Time.now < @auction.actual_end_time
      link = set_link(@auction.id, 'dashboard')
      render json: { url: link }, status: 200
    elsif @auction.publish_status == '1' and @auction.actual_end_time < Time.now
      link = set_link(@auction.id, 'result')
      render json: { url: link }, status: 200
    else
      render json: nil, status: 200
    end
  end

  # POST create auction by ajax
  def create
    @auction = Auction.new(model_params)
    if @auction.save
      render json: @auction, status: 201
    else
      render json: 'error code ', status: 500
    end
  end

  # PATCH update auction by ajax
  def update
    if @auction.update(model_params)
      render json: @auction ,status: 200
    else
      render json: 'error code ', status: 500
    end
  end

  # PUT publish auction by ajax
  def publish
    if @auction.update(publish_status: params[:publish_status])
      render json: '@auction published', status: 200
    else
      render json: 'error code ', status: 500
    end
  end

  # POST hold auction
  def hold
  end

  # POST extend time
  def delay

  end

  # POST comfirm
  def comfirm
  end

  private

  def set_auction
    @auction = Auction.find(params[:id])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price)
  end

  def set_link (auctionId, addr)
    return "/admin/auctions/#{auctionId}/#{addr}"
  end

end
