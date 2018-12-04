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
    elsif !params[:contract_duration].blank?
      list = list_logic(params[:auction_id], params[:contract_duration])
      render json: list, status: 200
    else
      hash = {}
      auction.auction_contracts.each do |contract|
        if has_live_contract(contract)
          duration = contract.contract_duration
          hash.merge!({ "duration_#{duration}": list_logic(params[:auction_id], duration)})
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
      result = AuctionResult.find_by(auction_id: params[:auction_id])
      render json: { auction: auction, histories: histories, result: result }, status: 200
    elsif !params[:contract_duration].blank?
      contract = auction.auction_contracts.where('contract_duration = ?', params[:contract_duration]).take
      duration = contract.contract_duration
      histories = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true and contract_duration = ? order by bid_time desc LIMIT 1) order by ranking asc , actual_bid_time asc', auction.id, duration]
      result = auction.auction_result.blank? ? nil : auction.auction_result.auction_result_contracts.where('contract_duration = ?' , contract.contract_duration).take
      auction.contract_period_end_date = contract.contract_period_end_date
      auction.total_lt_peak = contract.total_lt_peak
      auction.total_lt_off_peak = contract.total_lt_off_peak
      auction.total_hts_peak = contract.total_hts_peak
      auction.total_hts_off_peak = contract.total_hts_off_peak
      auction.total_htl_peak = contract.total_htl_peak
      auction.total_htl_off_peak = contract.total_htl_off_peak
      auction.total_eht_peak = contract.total_eht_peak
      auction.total_eht_off_peak = contract.total_eht_off_peak
      auction.total_volume = contract.total_volume
      render json: { auction: auction, histories: histories, result: result, aggregate_consumptions: get_aggregate_consumptions(contract) }, status: 200
    else
      hash = {}
      auction.auction_contracts.each do |contract|
        duration = contract.contract_duration
        if has_live_contract(contract)
          histories = AuctionHistory.find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true and contract_duration = ? order by bid_time desc LIMIT 1) order by ranking asc , actual_bid_time asc', auction.id, duration]
          result = auction.auction_result.blank? ? nil : auction.auction_result.auction_result_contracts.where('contract_duration = ?' , contract.contract_duration).take
          auction.contract_period_end_date = contract.contract_period_end_date
          auction.total_volume = contract.total_volume
          auction_json = auction.attributes.dup
          hash.merge!({ "duration_#{duration}": { auction: auction_json, histories: histories, result: result, aggregate_consumptions: get_aggregate_consumptions(contract) }})
        end

      end
      render json: hash, status: 200
    end

  end

  private

  def get_aggregate_consumptions(contract)
    has_lt = !is_zero(contract.total_lt_peak, contract.total_lt_off_peak)
    has_hts = !is_zero(contract.total_hts_peak, contract.total_hts_off_peak)
    has_htl = !is_zero(contract.total_htl_peak, contract.total_htl_off_peak)
    has_eht = !is_zero(contract.total_eht_peak, contract.total_eht_off_peak)
    if has_lt || has_hts || has_htl || has_eht
      base_contract = {has_lt: has_lt, has_hts: has_hts, has_htl: has_htl, has_eht: has_eht,
                       starting_price_lt_peak: contract.starting_price_lt_peak,
                       starting_price_lt_off_peak: contract.starting_price_lt_off_peak,
                       starting_price_hts_peak: contract.starting_price_hts_peak,
                       starting_price_hts_off_peak: contract.starting_price_hts_off_peak,
                       starting_price_htl_peak: contract.starting_price_htl_peak,
                       starting_price_htl_off_peak: contract.starting_price_htl_off_peak,
                       starting_price_eht_peak: contract.starting_price_eht_peak,
                       starting_price_eht_off_peak: contract.starting_price_eht_off_peak,
                       contract_period_end_date: contract.contract_period_end_date,
                       contract_duration: contract.contract_duration,
                       total_lt_peak: contract.total_lt_peak,
                       total_lt_off_peak: contract.total_lt_off_peak,
                       total_hts_peak: contract.total_hts_peak,
                       total_hts_off_peak: contract.total_hts_off_peak,
                       total_htl_peak: contract.total_htl_peak,
                       total_htl_off_peak: contract.total_htl_off_peak,
                       total_eht_peak: contract.total_eht_peak,
                       total_eht_off_peak: contract.total_eht_off_peak}
      base_contract
    end
  end


  def list_logic(auction_id, contract_duration)
    @histories = AuctionHistory.joins("INNER JOIN arrangements ON (arrangements.user_id = auction_histories.user_id AND arrangements.auction_id = auction_histories.auction_id)").
      where("auction_histories.auction_id = ? AND arrangements.accept_status = '1'", auction_id).
      joins(:user).select("users.name, users.company_name, auction_histories.*").order(:bid_time)
    if contract_duration.present?
      @histories = @histories.where("auction_histories.contract_duration = ?", contract_duration)
    end

    @histories.to_a.group_by(&:user_id).map do |user_id, histories|
      history = HistoriesDto.new
      history.id = user_id
      history.data = histories
      history
    end
  end
end
