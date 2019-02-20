FactoryBot.define do
  factory :consumption do
    action_status { '2' }
    participation_status { '2' }
  end

  trait :init do
    lt_peak { 100 }
    lt_off_peak { 100 }
    hts_peak { 100 }
    hts_off_peak { 100 }
    htl_peak { 100 }
    htl_off_peak { 100 }
    eht_peak { 100 }
    eht_off_peak { 100 }
  end
end

