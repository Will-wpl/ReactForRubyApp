require 'rails_helper'

RSpec.describe BidJob, type: :job do
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
  describe 'perform' do
    def do_request(args)
      BidJob.perform_later(args)
    end

    it 'success' do
      begin_time = Date.current
      end_time = Date.current + 100
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
      calculate_dto.begin_time = begin_time
      calculate_dto.end_time = end_time
      args = { auction_id:  auction.id, calculate_dto: calculate_dto }.to_json
      calculate_dto = CalculateDto.new(arrangement)
      AuctionHistory.save_update_sort_init_auction_histories(calculate_dto)
      expect(do_request(args)).not_to eq(nil)
    end
  end
end
