require 'feature_helper'

RSpec.describe 'auction start', type: :feature, js: true do
  context 'auction published but not starting yet' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }

    let!(:admin_user) { create(:user, :with_admin) }

    let!(:retailer_user) { create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, :accepted, user: retailer_user, auction: auction) }

    let!(:late_retailer_user) { create(:user, :with_retailer) }
    let!(:unaccepted_arrangement) { create(:arrangement, user: late_retailer_user, auction: auction) }

    describe 'visit commence and bid page' do
      it 'shows valid details' do
        in_browser(:admin) do
          login_as(admin_user)

          visit admin_home_index_path
          click_link 'Manage Published Upcoming Reverse Auction'

          expect(page).to have_content 'Manage Upcoming Reverse Auction'
          expect(page).to have_selector('.bidders_list')
          expect(all('ul.bidders_list li')[0]).to have_selector('span', text: retailer_user.company_name)
          expect(all('ul.bidders_list li')[0]).to have_selector('.color1')
          expect(all('ul.bidders_list li')[1]).to have_selector('span', text: late_retailer_user.company_name)
          expect(all('ul.bidders_list li')[1]).to_not have_selector('.color1')
        end

        in_browser(:retailer) do
          visit new_user_session_path

          within('form.new_user') do
            fill_in 'user_email', with: retailer_user.email
            fill_in 'user_password', with: 'password'
            click_button 'Login'
          end

          click_link 'Start Bidding'

          expect(page).to have_content 'Please standby, bidding will commence soon'
        end

        # Check on navigation tracking (on bidding page or not)
        in_browser(:admin) do
          click_link 'Commence'

          expect(page).to have_selector('.bidders_list')
          expect(all('ul.bidders_list')[0]).to have_selector('span', text: retailer_user.company_name)
        end

        in_browser(:retailer) do
          click_link 'Back to Homepage'
          expect(page).to have_selector('a', text: 'Start Bidding')
        end

        in_browser(:admin) do
          expect(all('ul.bidders_list')[1]).to have_selector('span', text: retailer_user.company_name, wait: 5)
        end

        in_browser(:retailer) do
          click_link 'Start Bidding'

          expect(page).to have_content 'Please standby, bidding will commence soon'
        end

        in_browser(:admin) do
          expect(all('ul.bidders_list')[0]).to have_selector('span', text: retailer_user.company_name, wait: 5)
        end
      end
    end
  end

  context 'auction published and started' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }

    let!(:admin_user) { create(:user, :with_admin) }

    let!(:retailer_user) { create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, :accepted, user: retailer_user, auction: auction) }

    describe 'visit commence and bid page' do
      describe 'admin' do
        before do
          login_as(admin_user)
        end

        it 'sees valid details' do
          visit admin_home_index_path
          click_link 'Manage Published Upcoming Reverse Auction'

          expect(page).to have_content 'Reverse Auction has commenced. Please start bidding'
        end
      end

      describe 'retailer' do
        before do
          login_as(retailer_user)
        end

        it 'sees valid details' do
          visit retailer_home_index_path
          click_link 'Start Bidding'

          expect(page).to have_content 'Reverse Auction has commenced. Please start bidding'
        end
      end
    end
  end
end
