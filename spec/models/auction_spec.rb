require 'rails_helper'

RSpec.describe Auction, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:arrangements) }
    it { is_expected.to have_many(:consumptions) }
    it { is_expected.to have_many(:auction_histories) }
    it { is_expected.to have_many(:auction_events) }
    it { is_expected.to have_one(:auction_result) }
  end

  describe '.set_total_volume' do
    it 'calculates' do
      result = Auction.set_total_volume('9.9', '9.9', '9.9', '9.9', '9.9', '9.9')

      expect(result).to eq 59.4
    end
  end
end
