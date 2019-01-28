FactoryBot.define do
  factory :auction_event do
    auction_do { nil }
    auction_when { '2017-10-27 10:51:22' }
    auction_what { 'MyText' }
  end

end
