FactoryBot.define do
  factory :auction_history do
    average_price '9.99'
    lt_peak '9.99'
    lt_off_peak '9.99'
    hts_peak '9.99'
    hts_off_peak '9.99'
    htl_peak '9.99'
    htl_off_peak '9.99'
    user nil
    auction nil
  end
end
