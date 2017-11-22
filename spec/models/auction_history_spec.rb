require 'rails_helper'

RSpec.describe AuctionHistory, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
  end

  describe '.find_bidder_histories' do
    let!(:auction) { create(:auction) }
    let!(:user) { create(:user) }
    let!(:bidder_history) { create(:auction_history, auction: auction, user: user, is_bidder: true) }
    let!(:non_bidder_history) { create(:auction_history, auction: auction, user: user, is_bidder: false) }

    it 'returns bidders' do
      result = AuctionHistory.find_bidder_histories(auction.id)
      expect(result.count).to eq 1
      expect(result.first.id).to eq bidder_history.id
    end
  end

  describe '.set_total_award_sum' do
    it 'returns total award sum' do
      result = AuctionHistory.set_total_award_sum(
        ['2', '2', '2', '2', '2', '2'],
        ['3', '3', '3', '3', '3', '3']
      )

      expect(result).to eq 36
    end
  end
end
