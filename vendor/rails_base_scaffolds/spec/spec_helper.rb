require 'bundler/setup'

ENV['RAILS_ENV'] = 'test'
require File.expand_path('../dummy/config/environment', __FILE__)

require 'support/generators'

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end