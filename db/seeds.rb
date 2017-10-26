require "date"
if User.count == 0
  @admin = User.create(name: 'admin',
                       email: 'admin@example.com',
                       password: 'password',
                       password_confirmation: 'password')

  @admin.add_role :admin
  Role.create(name: 'retailer')
  Role.create(name: 'buyer')
end

if Auction.count == 0
  Auction.create(name: 'SP Reverse Auction',
                 start_datetime: DateTime.new(2017, 12, 1,
                                              10, 0, 0),
                 contract_period_start_date: Date.new(2018, 1, 1),
                 contract_period_end_date: Date.new(2018, 6, 30),
                 duration: 10,
                 reserve_price: 0.1477)
end

if Arrangement.count == 0
  result = Arrangement.create(main_name: 'mark',
                     main_email_address: 'mark@example.com',
                     main_mobile_number: '87654321',
                     main_office_number: '12345678',
                     lt_peak: 0.1231,
                     lt_off_peak: 0.2121,
                     hts_peak: 0.2121,
                     hts_off_peak: 0.3212,
                     htl_peak: 0.1111,
                     htl_off_peak: 0.3332,
                     user_id: 2,
                     auction_id: 2,
                     )
  p result
end

