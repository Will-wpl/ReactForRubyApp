FactoryBot.define do
  factory :user_attachment do
    file_name { Faker::File.file_name }
    file_path { Faker::File.file_name('abc/def/') }
  end

  trait :sbtc do
    file_type { 'SELLER_BUYER_TC' }
  end

  trait :srtc do
    file_type { 'SELLER_REVV_TC' }
  end

  trait :brtc do
    file_type { 'BUYER_REVV_TC' }
  end

  trait :tmtc do
    file_type { 'TENANT_MGMT_TC' }
  end

end
