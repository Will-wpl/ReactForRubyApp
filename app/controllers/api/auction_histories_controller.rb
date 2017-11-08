class Api::AuctionHistoriesController < ApplicationController

  # get histories by user_id and auction_id
  def show
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and user_id = ?', params[:auction_id], params[:user_id]).order(bid_time: :asc)
    render json: @histories, status: 200
  end

  # get all users history list by auction_id
  def list
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ?', params[:auction_id]).order(bid_time: :asc)
    # @users = Auction.find(params[:auction_id]).users
    @arrangements = Arrangement.where("auction_id = ? and accept_status = '1'", params[:auction_id])
    hash = Hash.new
    list = Array.new
    @arrangements.each do |arrangement|
      hash[arrangement.user_id] = Array.new
    end
    @histories.each do |history|
      hash[history.user_id].push(history)
    end

    hash.each do |key, value|
      history = HistoriesDto.new
      history.id = key
      history.data = value
      list.push(history)
    end

    render json: list, status: 200
  end

  # get comfirm winner infomation by auction_id
  def last
    auction = Auction.find(params[:auction_id])
    histories = AuctionHistory.find_by_sql ["select * from auction_histories where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1)", @auction.id]
    render json: { auction: auction, histories: histories }
  end

end
