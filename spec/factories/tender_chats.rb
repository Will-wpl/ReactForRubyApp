FactoryBot.define do
  factory :tender_chat do
    item { Faker::Number.between(1, 10) }
    clause { 'abc' }
  end
end
