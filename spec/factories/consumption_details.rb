FactoryBot.define do
  factory :consumption_detail do
    account_number { Faker::Number.between(1, 100) }
    peak { Faker::Number.number }
    off_peak { Faker::Number.number }
  end

  trait :for_lt do
    intake_level 'LT'
  end

  trait :for_hts do
    intake_level 'HTS'
  end

  trait :for_htl do
    intake_level 'HTL'
  end

  trait :for_eht do
    intake_level 'EHT'
  end

end
