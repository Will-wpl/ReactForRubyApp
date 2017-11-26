FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password 'password'
    password_confirmation 'password'
    company_name { Faker::Company.name }

    trait :with_admin do
      company_name { 'SP Group' }

      after(:create) do |user|
        user.add_role(:admin)
      end
    end

    trait :with_retailer do
      after(:create) do |user|
        user.add_role(:retailer)
      end
    end
  end
end
