FactoryBot.define do
  factory :request_auction do
    name { Faker::Company.name }
    duration { 6 }
    buyer_type { '0' }
    allow_deviation { 'yes' }
  end
end
