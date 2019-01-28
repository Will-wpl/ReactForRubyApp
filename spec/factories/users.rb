FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password' }
    password_confirmation { 'password' }

    trait :with_admin do
      company_name { 'SP Group' }
      after(:create) do |user|
        user.add_role(:admin)
      end
    end

    trait :with_retailer do
      approval_status { '1' }
      consumer_type { '1' }
      company_name { Faker::Company.name }
      company_address { Faker::Address.full_address }
      company_unique_entity_number { Faker::Code.asin }
      company_license_number { Faker::Code.asin }
      account_mobile_number { Faker:: PhoneNumber.phone_number }
      account_office_number { Faker:: PhoneNumber.phone_number }
      after(:create) do |user|
        user.add_role(:retailer)
      end
    end

    trait :with_buyer do
      after(:create) do |user|
        user.add_role(:buyer)
      end
    end

    trait :with_company_buyer do
      approval_status { '1' }
      consumer_type { '2' }
      company_name { Faker::Company.name }
      company_address { Faker::Address.full_address }
      company_unique_entity_number { Faker::Code.asin }
      name { Faker::Name.name }
      account_mobile_number { Faker:: PhoneNumber.phone_number }
      account_office_number { Faker:: PhoneNumber.phone_number }
    end

    trait :with_individual_buyer do
      approval_status { '1' }
      consumer_type { '3' }
      name { Faker::Name.name }
      account_fin { Faker::Code.imei }
      account_housing_type { '1' }
      account_mobile_number { Faker:: PhoneNumber.phone_number }
      account_office_number { Faker:: PhoneNumber.phone_number }
      account_home_number { Faker:: PhoneNumber.phone_number }
    end

    trait :with_admin_id_1 do
      company_name { 'SP Group' }
      id { 1 }
      after(:create) do |user|
        user.add_role(:admin)
      end
    end


    trait :with_buyer_entity do
      after(:create) do |user|
        user.add_role(:entity)
      end
    end

    trait :with_tenant do
      after(:create) do |user|
        user.add_role(:tenant)
      end
    end
  end


end
