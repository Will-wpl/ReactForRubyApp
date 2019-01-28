FactoryBot.define do
  factory :auction_contract do
    starting_price_lt_peak { 0.1888 }
    starting_price_lt_off_peak { 0.1888 }
    starting_price_hts_peak { 0.1888 }
    starting_price_hts_off_peak { 0.1888 }
    starting_price_htl_peak { 0.1888 }
    starting_price_htl_off_peak { 0.1888 }
    starting_price_eht_peak { 0.1888 }
    starting_price_eht_off_peak { 0.1888 }

    reserve_price_lt_peak { 0.0988 }
    reserve_price_lt_off_peak { 0.0988 }
    reserve_price_hts_peak { 0.0988 }
    reserve_price_hts_off_peak { 0.0988 }
    reserve_price_htl_peak { 0.0988 }
    reserve_price_htl_off_peak { 0.0988 }
    reserve_price_eht_peak { 0.0988 }
    reserve_price_eht_off_peak { 0.0988 }
  end

  trait :six_month do
    contract_duration { '6' }
    contract_period_end_date { DateTime.now.advance(months: 6).advance(days: -1) }
  end

  trait :twelve_month do
    contract_duration { '12' }
    contract_period_end_date { DateTime.now.advance(months: 12).advance(days: -1) }
  end

  trait :twenty_four_month do
    contract_duration { '24' }
    contract_period_end_date { DateTime.now.advance(months: 24).advance(days: -1) }
  end

  trait :total do
    total_volume { 80000 }
    total_lt_peak { 1000 }
    total_lt_off_peak { 1000 }
    total_hts_peak { 1000 }
    total_hts_off_peak { 1000 }
    total_htl_peak { 1000 }
    total_htl_off_peak { 1000 }
    total_eht_peak { 1000 }
    total_eht_off_peak { 1000 }
  end
end
