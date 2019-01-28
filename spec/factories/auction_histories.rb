FactoryBot.define do
  factory :auction_history do
    average_price { 0.1458 }
    lt_peak { 0.1458 }
    lt_off_peak { 0.1458 }
    hts_peak { 0 }
    hts_off_peak { 0 }
    htl_peak { 0.1458 }
    htl_off_peak { 0.1458 }
    eht_peak { 0.1458 }
    eht_off_peak { 0.1458 }
    bid_time { nil }
    total_award_sum { 989_763.5916 }
    ranking { 1 }
    is_bidder { true }
    user { nil }
    auction { nil }
    actual_bid_time { nil }
  end

  trait :set_bid do
    average_price { 0.1233 }
    lt_peak { 0.1233 }
    lt_off_peak { 0.1233 }
    htl_peak { 0.1233 }
    htl_off_peak { 0.1233 }
    total_award_sum { 837022.2966 }
    flag { 'e2545e44-8394-489c-8976-d3454f5a561a' }
  end

  trait :not_bid do
    ranking { 2 }
    is_bidder { false }
    flag { 'e2545e44-8394-489c-8976-d3454f5a561a' }
  end
end
