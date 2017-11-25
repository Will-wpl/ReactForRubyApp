require 'feature_helper'

RSpec.describe 'admin create / edit auction', type: :feature, js: true do
  let(:admin_user) { create(:user, :with_admin) }

  before do
    login_as(admin_user)
  end

  xdescribe 'creates auction' do
    let!(:auction) { create(:auction) }

    it 'creates a new auction' do
      visit new_admin_auction_path

      fill_in 'name', with: 'SP Reverse Auction 0001'
      fill_in 'start_datetime', with: '23-11-2017 21:03'
      fill_in 'contract_period_start_date', with: '01-11-2017'
      fill_in 'contract_period_end_date', with: '31-11-2017'
      fill_in 'duration', with: '5'
      fill_in 'reserve_price', with: '0.0841'
      click_button 'Save'

      expect(page).to have_content 'Successful'
    end
  end

  describe 'edit auction' do
    let!(:auction) do
      create(:auction, :for_next_month, :upcoming)
    end

    it 'updates an existing auction' do
      visit new_admin_auction_path

      fill_in 'name', with: 'SP Reverse Auction 0001'
      fill_in 'duration', with: '10'
      fill_in 'reserve_price', with: '0.0821'
      click_button 'Save'

      expect(page).to have_content 'successfully saved'

      auction.reload
      expect(auction.name).to eq 'SP Reverse Auction 0001'
      expect(auction.duration).to eq 10
      expect(auction.reserve_price).to eq BigDecimal.new('0.0821')
    end
  end

  describe 'publish auction' do
    let!(:auction) do
      create(:auction, :for_next_month, :upcoming)
    end

    it 'publishes an existing auction' do
      visit new_admin_auction_path

      click_button 'Publish'

      expect(page).to have_content 'successfully published'

      auction.reload
      expect(auction.publish_status).to eq '1'
    end
  end

  describe 'published auction' do
    let!(:auction) do
      create(:auction, :for_next_month, :upcoming, :published)
    end

    it 'not editable' do
      visit new_admin_auction_path

      expect(page).to have_field('name', disabled: true)
      expect(page).to have_field('start_datetime', disabled: true)
      expect(page).to have_field('contract_period_start_date', disabled: true)
      expect(page).to have_field('contract_period_end_date', disabled: true)
      expect(page).to have_field('duration', disabled: true)
      expect(page).to have_field('reserve_price', disabled: true)
    end
  end
end
