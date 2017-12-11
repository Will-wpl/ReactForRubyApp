require 'feature_helper'

RSpec.describe 'sign in', type: :feature do
  before do
    create(:user, :with_admin, email: 'admin@example.com', password: 'password')
    create(:user, :with_retailer, email: 'retailer@example.com', password: 'password')
  end

  describe 'admin user' do
    it 'can sign in' do
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
  end

  describe 'retailer user' do
    it 'can sign in' do
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
