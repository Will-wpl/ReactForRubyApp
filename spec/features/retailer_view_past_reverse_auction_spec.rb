require 'feature_helper'

RSpec.describe 'retailer view past auctions', type: :feature, js: true do
  let!(:retailer_user) { create(:user, :with_retailer) }

  before do
    login_as(retailer_user)
  end

  context 'no past auctions' do
    let!(:auction) { create(:auction) }

    it 'has no auction shown' do
      visit retailer_home_index_path

      click_link 'View Past Reverse Auction'

      expect(page).to have_content 'You have no past Reverse Auction record'
    end
  end
end
