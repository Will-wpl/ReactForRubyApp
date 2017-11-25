FactoryBot.define do
  factory :arrangement do
    accept_status '2'
    main_name ''
    main_email_address ''
    main_mobile_number ''
    main_office_number ''
    alternative_name ''
    alternative_email_address ''
    alternative_mobile_number ''
    alternative_office_number ''

    trait :accepted do
      main_name { Faker::Name.name }
      main_email_address { Faker::Internet.email }
      main_mobile_number { "9#{Faker::Number.number(7)}" }
      main_office_number { "6#{Faker::Number.number(7)}" }
      alternative_name { Faker::Name.name }
      alternative_email_address { Faker::Internet.email }
      alternative_mobile_number { "9#{Faker::Number.number(7)}" }
      alternative_office_number { "6#{Faker::Number.number(7)}" }
      accept_status '1'
    end
  end
end
