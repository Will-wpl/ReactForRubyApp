require 'rails_helper'

RSpec.describe User, type: :model do
  context 'factory' do
    it { expect(build(:user)).to be_valid }
  end

  context 'validations' do
    it { is_expected.to validate_presence_of :name }
  end

  describe 'associations' do
    it { is_expected.to have_one(:user_extension) }
    it { is_expected.to have_many(:company_buyer_entities) }
    it { is_expected.to have_many(:arrangements) }
    it { is_expected.to have_many(:auctions).through(:arrangements) }
    it { is_expected.to have_many(:auction_events) }
    it { is_expected.to have_many(:auction_extend_times) }
    it { is_expected.to have_many(:auction_histories) }
  end
end
