require 'feature_helper'

RSpec.describe 'admin view past auctions', type: :feature, js: true do
  let(:admin_user) { create(:user, :with_admin) }

  before do
    login_as(admin_user)
  end

  context 'no past auctions' do
    it 'has no auction shown' do
      visit admin_home_index_path

      click_link 'View Past Reverse Auction'

      expect(page).to have_content 'You have no past Reverse Auction record'
    end
  end
end
