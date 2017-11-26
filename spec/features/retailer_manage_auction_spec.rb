require 'feature_helper'

RSpec.describe 'retailer manage auction', type: :feature, js: true do
  let!(:retailer_user) { create(:user, :with_retailer) }

  before do
    login_as(retailer_user)
  end

  describe 'no upcoming auction' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming) }

    it 'nothing to do' do
      visit retailer_home_index_path

      click_link 'Manage Upcoming Reverse Auction'

      expect(page).to have_content 'There is no upcoming reverse auction published'
    end
  end

  context 'has upcoming auction' do
    describe 'accepting arrangement' do
      let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

      it 'updates contact form' do
        visit retailer_home_index_path

        click_link 'Manage Upcoming Reverse Auction'

        expect(page).to have_content 'Contact Person Details for Actual Day of Reverse Auction'
        expect(page).to have_content 'Countdown Timer'
        expect(page).to have_content 'Main Contact Person on Actual Bidding Day'
        expect(page).to have_content 'Alternative Contact Person on Actual Bidding Day'

        fill_in 'main_name', with: 'Martin Short'
        fill_in 'main_email_address', with: 'martin.short@gmail.com'
        fill_in 'main_mobile_number', with: '91881111'
        fill_in 'main_office_number', with: '62561244'
        fill_in 'alternative_name', with: 'William Tell'
        fill_in 'alternative_email_address', with: 'william.tell@gmail.com'
        fill_in 'alternative_mobile_number', with: '91881112'
        fill_in 'alternative_office_number', with: '64561111'

        execute_script('window.scroll(0,1000);')

        click_button 'Submit'

        expect(page).to have_content "Your details have been successfully submitted"
      end
    end

    describe 'updating arrangement' do
      let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
      let!(:arrangement) { create(:arrangement, :accepted, user: retailer_user, auction: auction) }

      it 'updates contact form' do
        visit retailer_home_index_path

        click_link 'Manage Upcoming Reverse Auction'

        expect(page).to have_field('main_name', disabled: true)
        expect(page).to have_field('main_email_address', disabled: true)
        expect(page).to have_field('main_mobile_number', disabled: true)
        expect(page).to have_field('main_office_number', disabled: true)
        expect(page).to have_field('alternative_name', disabled: true)
        expect(page).to have_field('alternative_email_address', disabled: true)
        expect(page).to have_field('alternative_mobile_number', disabled: true)
        expect(page).to have_field('alternative_office_number', disabled: true)

        execute_script('window.scroll(0,1000);')
        find('a', text: 'Edit').click

        execute_script('window.scroll(0,0);')

        fill_in 'main_name', with: 'Martin Short'
        execute_script('window.scroll(0,1000);')
        click_button 'Submit'

        expect(page).to have_content "Your details have been successfully submitted"

        arrangement.reload
        expect(arrangement.main_name).to eq 'Martin Short'
      end
    end
  end

  context 'auction started' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

    it 'unable to participate' do
      visit retailer_home_index_path

      click_link 'Manage Upcoming Reverse Auction'

      expect(page).to have_content 'We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hope to see you again in future reverse auctions'
    end
  end
end