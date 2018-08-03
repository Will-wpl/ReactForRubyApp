class AuctionChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "auction_#{params[:auction_id]}"
  end

  def unsubscribed; end

  def limit_user(data)
    timestamp = data['timestamp']
    ActionCable.server.broadcast "auction_#{params[:auction_id]}", action: 'limit_user', data: { user_id: params[:user_id], timestamp: timestamp }
  end

  def extend_time(data)
    auction = Auction.find(params[:auction_id])
    extend_time = data['extend_time'].to_i
    user_id = params[:user_id]
    AuctionExtendTime.set_extend_time(auction, extend_time, user_id)
    ActionCable.server.broadcast "auction_#{params[:auction_id]}", action: 'extend', data: { minutes: extend_time }
  end

  def set_bid(data)
    auction = Auction.find(params[:auction_id])
    calculate_dto = CalculateDto.new
    contract = auction.auction_contracts.where('contract_duration = ?', data['contract_duration']).take
    if contract.blank?
      begin_time = auction.contract_period_start_date
      end_time = auction.contract_period_end_date
      calculate_dto.total_lt_peak = auction.total_lt_peak
      calculate_dto.total_lt_off_peak = auction.total_lt_off_peak
      calculate_dto.total_hts_peak = auction.total_hts_peak
      calculate_dto.total_hts_off_peak = auction.total_hts_off_peak
      calculate_dto.total_htl_peak = auction.total_htl_peak
      calculate_dto.total_htl_off_peak = auction.total_htl_off_peak
      calculate_dto.total_eht_peak = auction.total_eht_peak
      calculate_dto.total_eht_off_peak = auction.total_eht_off_peak
      calculate_dto.lt_peak = data['lt_peak']
      calculate_dto.lt_off_peak = data['lt_off_peak']
      calculate_dto.hts_peak = data['hts_peak']
      calculate_dto.hts_off_peak = data['hts_off_peak']
      calculate_dto.htl_peak = data['htl_peak']
      calculate_dto.htl_off_peak = data['htl_off_peak']
      calculate_dto.eht_peak = data['eht_peak']
      calculate_dto.eht_off_peak = data['eht_off_peak']
      calculate_dto.user_id = params[:user_id]
      calculate_dto.auction_id = params[:auction_id]
      calculate_dto.begin_time = begin_time
      calculate_dto.end_time = end_time
    else
      calculate_dto.total_lt_peak = contract.total_lt_peak
      calculate_dto.total_lt_off_peak = contract.total_lt_off_peak
      calculate_dto.total_hts_peak = contract.total_hts_peak
      calculate_dto.total_hts_off_peak = contract.total_hts_off_peak
      calculate_dto.total_htl_peak = contract.total_htl_peak
      calculate_dto.total_htl_off_peak = contract.total_htl_off_peak
      calculate_dto.total_eht_peak = contract.total_eht_peak
      calculate_dto.total_eht_off_peak = contract.total_eht_off_peak
      calculate_dto.lt_peak = data['lt_peak']
      calculate_dto.lt_off_peak = data['lt_off_peak']
      calculate_dto.hts_peak = data['hts_peak']
      calculate_dto.hts_off_peak = data['hts_off_peak']
      calculate_dto.htl_peak = data['htl_peak']
      calculate_dto.htl_off_peak = data['htl_off_peak']
      calculate_dto.eht_peak = data['eht_peak']
      calculate_dto.eht_off_peak = data['eht_off_peak']
      calculate_dto.user_id = params[:user_id]
      calculate_dto.auction_id = params[:auction_id]
      calculate_dto.begin_time = auction.contract_period_start_date
      calculate_dto.end_time = contract.contract_period_end_date
      calculate_dto.contract_duration = data['contract_duration']
    end

    args = { auction_id: params[:auction_id], calculate_dto: calculate_dto }.to_json

    BidJob.perform_later(args)
    # BidJob.perform_later(params[:auction_id], calculate_dto)
    # ActionCable.server.broadcast "auction_#{params[:auction_id]}", data: AuctionHistory.set_bid(calculate_dto), action: 'set_bid'
  end
end
