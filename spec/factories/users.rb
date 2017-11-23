FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password 'password'
    password_confirmation 'password'

    trait :with_admin do
      after(:create) do |user|
        user.add_role(:admin)
      end
    end
  end
end
