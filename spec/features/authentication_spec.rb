require 'feature_helper'

RSpec.feature 'sign in' do
  background do
    create(:user, :with_admin, email: 'admin@example.com', password: 'password')
    create(:user, :with_retailer, email: 'retailer@example.com', password: 'password')
  end

  scenario 'user can sign in', js: true do
    in_browser(:admin) do
      visit new_user_session_path

      within('form.new_user') do
        fill_in 'user_email', with: 'admin@example.com'
        fill_in 'user_password', with: 'password'
        click_button 'Login'
      end

      expect(page).to have_content 'Create/Edit New Reverse Auction'
      expect(page).to have_content 'Manage Published Upcoming Reverse Auction'
      expect(page).to have_content 'View Past Reverse Auction'
    end

    in_browser(:retailer) do
      visit new_user_session_path

      within('form.new_user') do
        fill_in 'user_email', with: 'retailer@example.com'
        fill_in 'user_password', with: 'password'
        click_button 'Login'
      end

      expect(page).to have_content 'Manage Upcoming Reverse Auction'
      expect(page).to have_content 'View Past Reverse Auction'
    end
  end
end
