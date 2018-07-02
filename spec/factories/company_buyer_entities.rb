FactoryBot.define do
  factory :company_buyer_entity do
    company_name { Faker::Company.name }
    company_uen { Faker::Company.australian_business_number }
    company_address { Faker::Address.full_address }
    billing_address { Faker::Address.full_address }
    bill_attention_to { Faker:: Markdown.emphasis }
    contact_name { Faker:: Name.name }
    contact_email { Faker:: Internet.email }
    contact_mobile_no { Faker:: PhoneNumber.phone_number }
    contact_office_no { Faker:: PhoneNumber.phone_number }
  end
end
