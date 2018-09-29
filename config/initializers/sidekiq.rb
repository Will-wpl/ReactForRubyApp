Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDISTOGO_URL"], password: ENV["REDISTOGO_PASSWORD"] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV["REDISTOGO_URL"], password: ENV["REDISTOGO_PASSWORD"]}
end  
