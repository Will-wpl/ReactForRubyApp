uri = URI.parse(ENV["REDISTOGO_URL"])
$redis = Redis.new(url: uri, password: ENV["REDISTOGO_PASSWORD"])
