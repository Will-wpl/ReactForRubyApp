source 'https://rubygems.org'

ruby '2.5.3'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.1'

gem 'pg'
gem 'puma'

# HTML, CSS and JavaScript Stack

gem 'sass-rails'
gem 'slim-rails'

gem 'jquery-rails'
gem 'uglifier'

gem 'font-awesome-sass'
gem 'webpacker', '~> 2.0'

# App Specific

gem 'carrierwave', '~> 1.0'
# Use cloud based storage
gem 'carrierwave-azure_rm'

## Utilities
gem 'breadcrumbs_on_rails'
gem 'kaminari'
gem 'rails_base_scaffolds', path: './vendor/rails_base_scaffolds'
gem 'rails_utils'
gem 'simple_form'
gem 'simple_form_customizations', path: './vendor/simple-form-customizations'

## Features

gem 'devise'
gem 'rolify'

gem 'local_time'

gem 'foreman', require: false
gem 'rubocop', require: false

# Use Redis adapter to run Action Cable in production
gem 'redis'

# Use sidekiq to run Action Job
gem 'sidekiq'

# Workaround with application in proxy calling external services
gem 'no_proxy_fix'

# Ruby Zip
gem 'rubyzip'

group :development, :test do
  # Call "byebug" anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri

  gem 'dotenv-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'rspec-rails'
  gem 'shoulda-matchers', '~> 3.1'

  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'spring-commands-rspec'

  gem 'timecop'

  gem 'simplecov', require: false
  gem 'codecov', require: false
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'listen', '~> 3.0.5'
  gem 'web-console', '>= 3.3.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'rails-erd'
  gem 'letter_opener_web', '~> 1.0'
end

group :test do
  gem 'database_rewinder'
  gem 'rspec_junit_formatter'
  gem 'email_spec'
end

gem 'newrelic_rpm', group: :production
gem 'prawn', '~> 2.2', '>= 2.2.2'
gem 'prawn-table', '~> 0.2.2'
gem 'wicked_pdf'
gem 'wkhtmltopdf-binary'
