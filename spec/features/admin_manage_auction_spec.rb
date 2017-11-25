require 'feature_helper'

RSpec.describe 'admin manage auction', type: :feature, js: true do
  let(:admin_user) { create(:user, :with_admin) }

  before do
    login_as(admin_user)
  end

  context 'no published auction' do
    let!(:auction) { create(:auction) }

    it 'has no auction shown' do
      visit admin_home_index_path

      click_link 'Manage Published Upcoming Reverse Auction'

      expect(page).to have_content 'There is no upcoming reverse auction published'
    end
  end

  context 'published auction' do
    let!(:auction) do
      create(:auction, :for_next_month, :upcoming, :published)
    end

    describe 'auction details' do
      it 'can be edited' do
        visit admin_home_index_path

        click_link 'Manage Published Upcoming Reverse Auction'

        expect(page).to have_content 'Manage Upcoming Reverse Auction'
        expect(page).to have_field('name', disabled: true)
        expect(page).to have_field('start_datetime', disabled: true)
        expect(page).to have_field('contract_period_start_date', disabled: true)
        expect(page).to have_field('contract_period_end_date', disabled: true)
        expect(page).to have_field('duration', disabled: true)
        expect(page).to have_field('reserve_price', disabled: true)

        execute_script('window.scroll(0,1000);')
        find('a', text: 'Edit').click

        execute_script('window.scroll(0,0);')
        fill_in 'name', with: 'Changed Title'
        fill_in 'duration', with: '10'
        fill_in 'reserve_price', with: '0.0840'

        execute_script('window.scroll(0,1000);')
        click_button 'Save'

        expect(page).to have_selector('a', text: 'Edit')

        auction.reload
        expect(auction.name).to eq 'Changed Title'
        expect(auction.reserve_price).to eq BigDecimal.new('0.0840')
      end
    end
  end
end
