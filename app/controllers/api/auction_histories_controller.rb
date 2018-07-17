class Api::AuctionHistoriesController < Api::BaseController
  # get histories by user_id and auction_id
  def show
    auction = Auction.find(params[:auction_id])
    @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and user_id = ?', params[:auction_id], current_user.id)
    if auction.auction_contracts.blank?
      @histories = @histories.order(bid_time: :asc)
      render json: @histories, status: 200
    else
      hash = {}
      auction.auction_contracts.each do |contract|
        if has_live_contract(contract)
          duration = contract.contract_duration
          @histories.where(contract_duration: duration).order(bid_time: :asc)
          hash.merge!({ "duration_#{duration}": @histories.where(contract_duration: duration).order(bid_time: :asc)})
        end
      end
      render json: hash, status: 200

    end


  end

  # get all users history list by auction_id
  def list
    auction = Auction.find(params[:auction_id])
    if auction.auction_contracts.blank?
      list = list_logic(params[:auction_id], nil)
      render json: list, status: 200
    else
      hash = {}
      auction.auction_contracts.each do |contract|
        if has_live_contract(contract)
          duration = contract.contract_duration
          hash.merge!({ "duration_#{duration}": list_logic(params[:auction_id], contract.contract_duration)})
        end
      end

      render json: hash, status: 200
    end

  end

  # get comfirm winner infomation by auction_id
  def last
    auction = Auction.find(params[:auction_id])
    if auction.auction_contracts.blank?
      histories = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc , actual_bid_time asc', auction.id]
      result = AuctionResult.find_by_auction_id(params[:auction_id])
      render json: { auction: auction, histories: histories, result: result }, status: 200
    elsif !params[:contract_duration].blank?
      contract = auction.auction_contracts.where('contract_duration = ?', params[:contract_duration]).take
      duration = contract.contract_duration
      histories = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true and contract_duration = ? order by bid_time desc LIMIT 1) order by ranking asc , actual_bid_time asc', auction.id, duration]
      result = auction.auction_result.blank? ? nil : auction.auction_result.auction_result_contracts.where('contract_duration = ?' , contract.contract_duration).take
      render json: { auction: auction, histories: histories, result: result }, status: 200
    else
      hash = {}
      auction.auction_contracts.each do |contract|
        duration = contract.contract_duration
        if has_live_contract(contract)
          histories = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true and contract_duration = ? order by bid_time desc LIMIT 1) order by ranking asc , actual_bid_time asc', auction.id, duration]
          result = auction.auction_result.blank? ? nil : auction.auction_result.auction_result_contracts.where('contract_duration = ?' , contract.contract_duration).take
        end
        hash.merge!({ "duration_#{duration}": { auction: auction, histories: histories, result: result }})
      end
      render json: hash, status: 200
    end

  end

  private

  def list_logic(auction_id, contract_duration)
    if contract_duration.blank?
      @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ?', auction_id).order(bid_time: :asc)
    else
      @histories = AuctionHistory.select('users.name, users.company_name, auction_histories.*').joins(:user).where('auction_id = ? and contract_duration = ?', auction_id, contract_duration).order(bid_time: :asc)
    end

    # @users = Auction.find(params[:auction_id]).users
    @arrangements = Arrangement.where("auction_id = ? and accept_status = '1'", auction_id)
    hash = {}
    list = []
    @arrangements.each do |arrangement|
      hash[arrangement.user_id] = []
    end
    if !@arrangements.empty? && !@histories.empty?
      @histories.each do |history|
        hash[history.user_id].push(history)
      end

      hash.each do |key, value|
        history = HistoriesDto.new
        history.id = key
        history.data = value
        list.push(history)
      end
    end
    list
  end
end
