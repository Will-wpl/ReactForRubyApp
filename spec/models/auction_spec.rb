require 'rails_helper'

RSpec.describe Auction, type: :model do
  describe 'associations' do
    it {is_expected.to have_many(:arrangements)}
    it {is_expected.to have_many(:consumptions)}
    it {is_expected.to have_many(:auction_histories)}
    it {is_expected.to have_many(:auction_events)}
    it {is_expected.to have_one(:auction_result)}
  end

  describe '.set_total_volume' do
    it 'calculates' do
      result = Auction.set_total_volume('9.9', '9.9', '9.9', '9.9', '9.9', '9.9')

      expect(result).to eq 59.4
    end
  end

  let! (:auction) {create(:auction, :for_next_month, :upcoming)}
  describe '.get_days' do

    it 'calculates' do
      start_dt = Date.new(2018, 1, 12)
      end_dt = Date.new(2018, 1, 13)
      result = Auction.get_days(start_dt, end_dt)
      expect(result).to eq(2)
    end

    it 'calculates' do
      start_dt = Date.new(2018, 1, 12)
      end_dt = Date.new(2018, 2, 13)
      result = Auction.get_days(start_dt, end_dt)
      expect(result).to eq(33)
    end
  end
end
