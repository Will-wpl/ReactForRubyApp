require 'rails_helper'

RSpec.describe BidJob, type: :job do

  describe 'perform' do
    let!(:retailer_user){ create(:user, :with_retailer) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
    let!(:r1_his_init) { create(:auction_history, bid_time: Date.current, user: retailer_user, auction: auction) }
    def do_request(args)
      BidJob.perform_later(args)
    end

    it 'success' do
      calculate_dto = CalculateDto.new
      calculate_dto.total_lt_peak = 10000
      calculate_dto.total_lt_off_peak = 10000
      calculate_dto.total_hts_peak = 10000
      calculate_dto.total_hts_off_peak = 10000
      calculate_dto.total_htl_peak = 10000
      calculate_dto.total_htl_off_peak = 10000
      calculate_dto.total_eht_peak = 10000
      calculate_dto.total_eht_off_peak = 10000
      calculate_dto.lt_peak = 100
      calculate_dto.lt_off_peak = 100
      calculate_dto.hts_peak = 100
      calculate_dto.hts_off_peak = 100
      calculate_dto.htl_peak = 100
      calculate_dto.htl_off_peak = 100
      calculate_dto.eht_peak = 100
      calculate_dto.eht_off_peak = 100
      calculate_dto.user_id = retailer_user.id
      calculate_dto.auction_id = auction.id
      calculate_dto.begin_time = auction.contract_period_start_date.to_s
      calculate_dto.end_time = auction.contract_period_end_date.to_s
      # args = { auction_id: auction.id, calculate_dto: calculate_dto }.to_json
      # expect(do_request(args)).not_to eq(nil)
      RedisHelper.set_current_sorted_histories(auction.id, [r1_his_init])
      result = AuctionHistory.set_bid(calculate_dto)

      histories = AuctionHistory.all
      expect(result.count).to eq(1)
      expect(result[0]['lt_peak']).to eq(100)
      expect(histories.count).to eq(2)
      redis_result = RedisHelper.get_current_sorted_histories(auction.id)
      expect(redis_result.count).to eq(1)
      expect(redis_result[0]['lt_peak']).to eq(100)
    end
  end

  describe 'new perform' do
    let!(:retailer_user){ create(:user, :with_retailer) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
    let!(:six_month_contract) { create(:auction_contract, :total, :six_month, auction: auction) }
    let!(:twelve_month_contract) { create(:auction_contract, :twelve_month, auction: auction) }
    let!(:twenty_four_month_contract) { create(:auction_contract, :total, :twenty_four_month, auction: auction) }
    let!(:r1_his_init_1) { create(:auction_history, bid_time: Date.current, user: retailer_user, auction: auction, contract_duration: '6') }
    let!(:r1_his_init_2) { create(:auction_history, bid_time: Date.current, user: retailer_user, auction: auction, contract_duration: '12') }
    let!(:r1_his_init_3) { create(:auction_history, bid_time: Date.current, user: retailer_user, auction: auction, contract_duration: '24') }

    def do_request(args)
      BidJob.perform_later(args)
    end

    it 'success' do
      begin_time = auction.contract_period_start_date.to_s
      end_time = six_month_contract.contract_period_end_date.to_s
      calculate_dto = CalculateDto.new
      calculate_dto.total_lt_peak = six_month_contract.total_lt_peak
      calculate_dto.total_lt_off_peak = six_month_contract.total_lt_off_peak
      calculate_dto.total_hts_peak = six_month_contract.total_hts_peak
      calculate_dto.total_hts_off_peak = six_month_contract.total_hts_off_peak
      calculate_dto.total_htl_peak = six_month_contract.total_htl_peak
      calculate_dto.total_htl_off_peak = six_month_contract.total_htl_off_peak
      calculate_dto.total_eht_peak = six_month_contract.total_eht_peak
      calculate_dto.total_eht_off_peak = six_month_contract.total_eht_off_peak
      calculate_dto.lt_peak = 10
      calculate_dto.lt_off_peak = 10
      calculate_dto.hts_peak = 10
      calculate_dto.hts_off_peak = 10
      calculate_dto.htl_peak = 10
      calculate_dto.htl_off_peak = 10
      calculate_dto.eht_peak = 10
      calculate_dto.eht_off_peak = 10
      calculate_dto.user_id = retailer_user.id
      calculate_dto.auction_id = auction.id
      calculate_dto.begin_time = begin_time
      calculate_dto.end_time = end_time
      calculate_dto.contract_duration = '6'

      RedisHelper.set_current_sorted_histories_duration(auction.id, [r1_his_init_1], '6')
      result = AuctionHistory.set_bid(calculate_dto)

      histories = AuctionHistory.all
      expect(result.count).to eq(1)
      expect(result[0]['lt_peak']).to eq(10)
      expect(histories.count).to eq(4)
      redis_result = RedisHelper.get_current_sorted_histories_duration(auction.id,'6')
      expect(redis_result.count).to eq(1)
      expect(redis_result[0]['lt_peak']).to eq(10)

      event = AuctionEvent.find_by_auction_do('set bid 6 months')
      expect(event.auction_do).to eq('set bid 6 months')
    end
  end
end
