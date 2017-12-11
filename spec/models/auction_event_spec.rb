require 'rails_helper'

RSpec.describe AuctionEvent, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
  end

  describe '.set_events' do
    let!(:user) { create(:user) }
    let!(:auction) { create(:auction) }

    it 'creates an AuctionEvent' do
      expect{
        AuctionEvent.set_events(user.id, auction.id, 'foo', 'bar')
      }.to change{
        AuctionEvent.count
      }
    end
  end
end
