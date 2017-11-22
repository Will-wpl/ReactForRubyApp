require 'rails_helper'

RSpec.describe AuctionResult, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:auction) }
  end
end
