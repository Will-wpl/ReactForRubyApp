require 'feature_helper'

RSpec.describe 'retailer bidding page', type: :feature, js: true do
  let!(:retailer_user) { create(:user, :with_retailer) }

  before do
    login_as(retailer_user)
  end

  context 'no published auctions' do
    let!(:auction) { create(:auction) }

    it 'has no auction shown' do
      visit retailer_home_index_path

      click_link 'Start Bidding'

      expect(page).to have_content 'There is no upcoming reverse auction published'
    end
  end
end
