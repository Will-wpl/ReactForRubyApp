FactoryBot.define do
  factory :auction_result do
    reserve_price { '9.99' }
    lowest_average_price { '9.99' }
    status { 'MyString' }
    lowest_price_bidder { 'MyString' }
    contract_period_start_date { '2017-10-27' }
    contract_period_end_date { '2017-10-27' }
    total_volume { '9.99' }
    total_award_sum { '9.99' }
    lt_peak { '9.99' }
    lt_off_peak { '9.99' }
    hts_peak { '9.99' }
    hts_off_peak { '9.99' }
    htl_peak { '9.99' }
    htl_off_peak { '9.99' }
    eht_peak { '9.99' }
    eht_off_peak { '9.99' }
    user { nil }
    auction { nil }
    trait :status_nil do
      status { nil }
    end
  end
end
