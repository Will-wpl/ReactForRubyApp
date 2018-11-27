FactoryBot.define do
  factory :request_auction do
    name { Faker::Company.name }
    duration 6
    buyer_type 'single'
    allow_deviation 'yes'
  end
end
