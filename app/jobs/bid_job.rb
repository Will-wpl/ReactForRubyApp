class BidJob < ApplicationJob
  queue_as :bid

  def perform(*args)
    # Do something later
    puts "==============================#{args[0]}"
    puts "Redis set auction"
  end
end