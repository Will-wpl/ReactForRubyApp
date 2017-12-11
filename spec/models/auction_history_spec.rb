require 'rails_helper'

RSpec.describe AuctionHistory, type: :model do

  current_time = Time.current
  bid_time = Time.current + 10
  let!(:admin_user) { create(:user, :with_admin) }
  let!(:retailer_user) { create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:retailer1) { create(:user, :with_retailer) }
  let!(:retailer2) { create(:user, :with_retailer) }
  let!(:retailer3) { create(:user, :with_retailer) }
  let!(:arrangement_1) { create(:arrangement, :accepted, user: retailer1, auction: auction) }
  let!(:arrangement_2) { create(:arrangement, :accepted, user: retailer2, auction: auction) }
  let!(:arrangement_3) { create(:arrangement, :accepted, user: retailer3, auction: auction) }
  let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time:current_time) }
  let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
  let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time:current_time) }
  let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time:bid_time) }
  let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
  let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time:current_time) }


  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
  end

  describe 'has_less_than_and_equal_to_average_price' do
    def do_request(average_price)
      AuctionHistory.has_less_than_or_equal_to_average_price(auction.id, retailer1.id, average_price)
    end

    # histories include (0.1458 , 0.1233)
    context "has less than average price" do
      it { expect(do_request(0.1455)).to eq(true) }
    end


    context "has equal to average price" do
      it { expect(do_request(0.1233)).to eq(true) }
    end

    context "has not less than and equal to average price" do
      it { expect(do_request(0.0008)).to eq(false) }
    end


    end
end
