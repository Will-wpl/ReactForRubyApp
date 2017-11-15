require 'feature_helper'

RSpec.feature 'sign up' do
  xscenario 'user can sign up', js: true do
    visit new_user_registration_path

    within('form.new_user') do
      fill_in 'user_name', with: 'Audrey Hepburn'
      fill_in 'user_email', with: 'user@example.com'
      fill_in 'user_password', with: 'password'
      fill_in 'user_password_confirmation', with: 'password'
      click_button 'Sign Up'
    end

    expect(page).to have_content 'signed up successfully'
  end
end

RSpec.feature 'sign in' do
  background do
    create(:user, email: 'user@example.com', password: 'password')
  end

  xscenario 'user can sign in', js: true do
    visit new_user_session_path

    within('form.new_user') do
      fill_in 'user_email', with: 'user@example.com'
      fill_in 'user_password', with: 'password'
      click_button 'Sign In'
    end

    expect(page).to have_content 'successfully'
  end
end
