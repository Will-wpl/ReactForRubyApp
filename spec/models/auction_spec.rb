require 'rails_helper'

RSpec.describe Auction, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:arrangements) }
    it { is_expected.to have_many(:users).through(:arrangements) }
    it { is_expected.to have_many(:auction_histories) }
    it { is_expected.to have_many(:auction_events) }
    it { is_expected.to have_one(:auction_result) }
  end
end
