Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => 'public, max-age=172800'
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Mail
  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }

  config.action_mailer.delivery_method = :letter_opener
  config.action_mailer.perform_deliveries = true

  # Custom Generators
  config.generators do |g|
    g.template_engine     :slim
    g.test_framework      :rspec, fixture: true
    g.fixture_replacement :factory_bot, dir: 'spec/factories'

    g.helper           false
    g.assets           false
    g.stylesheets      false
    g.javascripts      false

    g.routing_specs    false
    g.request_specs    false
    g.view_specs       false
    g.helper_specs     false
  end

  config.action_mailer.smtp_settings = {
      address:              '192.168.15.120',
      port:                 25,
      domain:               'dragonite-test.com',
      user_name:            'noreply@dragonite-test.com',
      password:             '123456',
      authentication:       'login',
      enable_starttls_auto: false,
      openssl_verify_mode: OpenSSL::SSL::VERIFY_NONE  }

  config.action_mailer.default_options = {
      from: "noreply@dragonite-test.com"
  }
end
