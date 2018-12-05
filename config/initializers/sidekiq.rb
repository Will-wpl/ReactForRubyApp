Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDISTOGO_URL"], password: ENV["REDISTOGO_PASSWORD"] }
  sidekiq_cron_file = "config/sidekiq_cron.yml"

  if File.exist?(sidekiq_cron_file) && Sidekiq.server?
    # Sidekiq.options[:poll_interval] = 10
    Sidekiq::Cron::Job.load_from_hash YAML.load_file(sidekiq_cron_file)
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV["REDISTOGO_URL"], password: ENV["REDISTOGO_PASSWORD"]}
end