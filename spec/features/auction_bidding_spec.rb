require 'feature_helper'

RSpec.describe 'auction bidding', type: :feature, js: true do
  after do
    Timecop.return
  end

  describe 'prepare, publish and start auction' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming) }

    let!(:admin_user) { create(:user, :with_admin) }

    let!(:retailer_user) { create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

    it 'allows bidding' do
      in_browser(:admin) do
        login_as(admin_user)

        visit new_admin_auction_path

        click_button 'Publish'

        expect(page).to have_content 'successfully published'

        auction.reload
        expect(auction.publish_status).to eq '1'
      end

      in_browser(:retailer) do
        visit new_user_session_path

        within('form.new_user') do
          fill_in 'user_email', with: retailer_user.email
          fill_in 'user_password', with: 'password'
          click_button 'Login'
        end

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

        visit retailer_home_index_path
        click_link 'Start Bidding'

        expect(page).to have_content 'Please standby, bidding will commence soon'
      end

      in_browser(:admin) do
        visit admin_home_index_path
        click_link 'Manage Published Upcoming Reverse Auction'

        expect(page).to have_content 'Manage Upcoming Reverse Auction'
        expect(page).to have_selector('.bidders_list') # Bidders who has accepted arrangement
        expect(all('ul.bidders_list li')[0]).to have_selector('span', text: retailer_user.company_name)
        expect(all('ul.bidders_list li')[0]).to have_selector('.color1')

        click_link 'Commence'

        expect(page).to have_selector('.bidders_list') # Bidders who are in the bidding room
        expect(all('ul.bidders_list')[0]).to have_selector('span', text: retailer_user.company_name)
      end

      Timecop.travel(DateTime.now.advance(minutes: 15).to_time)

      in_browser(:retailer) do
        fill_in 'peak_lt', with: '1222'
        fill_in 'peak_ht', with: '1222'
        fill_in 'off_peak_lt', with: '1222'
        fill_in 'off_peak_ht', with: '1222'
        click_button 'Submit'

        expect(page).to have_content 'Your bid has been successfully submitted'
      end

      in_browser(:admin) do
        expect(all('table.retailer_fill tbody')[0]).to have_selector('tr', wait: 5) # Wait for the row to be populated
        expect(all('table.retailer_fill tbody tr')[0]).to have_selector('td', text: retailer_user.company_name)
        expect(all('table.retailer_fill tbody tr')[0]).to have_selector('td', text: '$ 0.1222/kWh')
      end

      Timecop.travel(DateTime.now.advance(minutes: 30).to_time)

      in_browser(:admin) do
        expect(page).to have_content 'Reverse Auction has ended'
      end

      in_browser(:retailer) do
        expect(page).to have_content 'Reverse Auction has ended'
      end
    end
  end
end