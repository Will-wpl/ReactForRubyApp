FactoryBot.define do
  factory :tender_chat_detail do
    
  end

  trait :with_retailer do
    retailer_response { 'retailer said' }
    propose_deviation { 'cba' }
  end

  trait :with_sp do
    sp_response { 'sp said' }
  end

  trait :sp_accept do
    response_status { '1' }
  end

  trait :sp_reject do
    response_status { '0' }
  end
end
