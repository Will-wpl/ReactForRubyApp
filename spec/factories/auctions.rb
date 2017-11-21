FactoryGirl.define do
  factory :auction do
    name 'MyString'
    start_datetime '2017-10-26 15:42:52'
    contract_period_start_date '2017-10-26'
    contract_period_end_date '2017-10-26'
    duration 1
    reserve_price '9.99'
  end
end
