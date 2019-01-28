FactoryBot.define do
  factory :consumption_detail do
    account_number { Faker::Number.between(1, 100) }
    peak { Faker::Number.number }
    off_peak { Faker::Number.number }
  end

  trait :for_lt do
    intake_level { 'LT' }
    peak { 100 }
    off_peak { 100 }
  end

  trait :for_hts do
    intake_level { 'HTS' }
    peak { 100 }
    off_peak { 100 }
  end

  trait :for_htl do
    intake_level { 'HTL' }
    peak { 100 }
    off_peak { 100 }
  end

  trait :for_eht do
    intake_level { 'EHT' }
    peak { 100 }
    off_peak { 100 }
  end

end
