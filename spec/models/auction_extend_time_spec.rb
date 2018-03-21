require 'rails_helper'

RSpec.describe AuctionExtendTime, type: :model do
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }
  let!(:admin_user){ create(:user, :with_admin) }
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
  end

  describe 'set_extend_time' do

    def do_request(auction, extend_time, user_id)
      AuctionExtendTime.set_extend_time(auction, extend_time, user_id)
    end

    it 'success' do
      this_auction = auction
      extend_time = 100
      user_id = admin_user.id
      expect(do_request(this_auction, extend_time, user_id)).not_to eq(nil)
    end

  end
end
