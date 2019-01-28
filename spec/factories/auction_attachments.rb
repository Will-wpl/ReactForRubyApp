FactoryBot.define do
  factory :auction_attachment do
    file_name { Faker::File.file_name }
    file_path { Faker::File.file_name('abc/def/') }
  end

  trait :rcuu do
    file_type { 'retailer_confidentiality_undertaking_upload' }
  end

  trait :btu do
    file_type { 'buyer_tc_upload' }
  end

  trait :tdu do
    file_type { 'tender_documents_upload' }
  end

  trait :bpu do
    file_type { 'birefing_pack_upload' }
  end
end
