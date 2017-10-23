require 'rails_helper'

module FeatureAuthHelpers
  def fast_login(user)
    login_as(user, scope: :user)
  end

  def slow_login(user)
    visit new_user_session_path
    fill_in 'Email', with: user.email
    fill_in 'Password', with: 'password'
    click_button 'Sign In'
  end
end

include Warden::Test::Helpers
Warden.test_mode!

RSpec.configure do |config|
  config.after(:each) { Warden.test_reset! }
  config.include FeatureAuthHelpers

  config.use_transactional_fixtures = false

  config.before(:suite) do
    DatabaseRewinder.clean_all
  end

  config.after(:each) do
    DatabaseRewinder.clean
  end
end

webdriver_options = {
  browser: :chrome
}

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w(headless disable-gpu no-sandbox) }
  )
  webdriver_options[:desired_capabilities] = capabilities

  Capybara::Selenium::Driver.new(app, webdriver_options)
end

Capybara.javascript_driver = :headless_chrome
