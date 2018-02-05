require 'feature_helper'

RSpec.xdescribe 'retailer bidding page', type: :feature, js: true do
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

  context 'auction started' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

    it 'unable to participate' do
      visit retailer_home_index_path

      click_link 'Start Bidding'

      expect(page).to have_content 'We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hope to see you again in future reverse auctions'
    end
  end
end
