FactoryBot.define do
  factory :user_detail do
    company_address { Faker::Address.full_address }
    company_unique_entity_number { Faker::Code.asin }
    company_license_number { Faker::Code.asin }
    account_fin { Faker::Code.asin }
    account_mobile_number { Faker::PhoneNumber.phone_number }
    account_office_number { Faker::PhoneNumber.phone_number }
    account_home_number { Faker::PhoneNumber.phone_number }
    account_housing_type 'HDB'
    account_home_address { Faker::Address.full_address }

    trait :with_company_buyer do
      consumer_type '0'
    end

    trait :with_individual_buyer do
      consumer_type '1'
    end
  end
end
