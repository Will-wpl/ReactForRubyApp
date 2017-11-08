class Api::AuctionHistoriesController < ApplicationController

  # get histories by user_id and auction_id
  def show
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and user_id = ?', params[:auction_id], params[:user_id]).order(bid_time: :asc)
    render json: @histories, status: 200
  end

  # get all users history list by auction_id
  def list
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ?', params[:auction_id]).order(bid_time: :asc)
    @users = Auction.find(params[:auction_id]).users
    hash = Hash.new
    list = Array.new
    @users.each do |user|
      hash[user.id] = Array.new
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

end
