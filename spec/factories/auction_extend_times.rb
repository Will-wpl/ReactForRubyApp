FactoryBot.define do
  factory :auction_extend_time do
    extend_time { '2017-11-08 11:04:42' }
    current_time { '2017-11-08 11:04:42' }
    actual_begin_time { '2017-11-08 11:04:42' }
    actual_end_time { '2017-11-08 11:04:42' }
  end
end
