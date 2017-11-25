FactoryBot.define do
  factory :auction do
    name 'SP Reverse Auction November 2017'
    publish_status '0'
    total_lt_peak 2_468_375
    total_lt_off_peak 1_544_695
    total_hts_peak 0
    total_hts_off_peak 0
    total_htl_peak 1_983_720
    total_htl_off_peak 791_712
    duration 10
    reserve_price { BigDecimal.new('0.0841') }

    trait :for_next_month do
      contract_period_start_date { DateTime.now.advance(months: 1).beginning_of_month }
      contract_period_end_date { DateTime.now.advance(months: 1).end_of_month }
    end

    trait :upcoming do
      start_datetime { DateTime.now.advance(minutes: 10) }
    end

    trait :published do
      publish_status '1'
    end

    trait :started do
      start_datetime { DateTime.now.advance(minutes: -5) }
    end
  end
end
