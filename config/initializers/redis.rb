uri = URI.parse(ENV["REDIS_URL"])
$redis = Redis.new(url: uri)
