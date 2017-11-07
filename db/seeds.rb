require 'date'
if User.count == 0
  @admin = User.create(name: 'admin',
                       email: 'admin@example.com',
                       password: 'password',
                       password_confirmation: 'password')

  @admin.add_role :admin
  Role.create(name: 'retailer')
  Role.create(name: 'buyer')

  @mark = User.create(name: 'mark',
                      email: 'mark@example.com',
                      password: 'password',
                      password_confirmation: 'password',
                      company_name: 'Keppel Electric Mark')
  @mark.add_role :retailer

  @brian = User.create(name: 'brian',
                       email: 'brian@example.com',
                       password: 'password',
                       password_confirmation: 'password',
                       company_name: 'SembCorp Power Brian')
  @brian.add_role :retailer

  @jason = User.create(name: 'jason',
                       email: 'jason@example.com',
                       password: 'password',
                       password_confirmation: 'password',
                       company_name: 'Tuas Power Supply Jason')
  @jason.add_role :retailer

  @will = User.create(name: 'will',
                      email: 'will@example.com',
                      password: 'password',
                      password_confirmation: 'password',
                      company_name: 'Senoko Energy Supply Will')
  @will.add_role :retailer

  @judy = User.create(name: 'judy',
                      email: 'judy@example.com',
                      password: 'password',
                      password_confirmation: 'password',
                      company_name: 'Cleantech Solar Management Company Judy')
  @judy.add_role :retailer
end

if Auction.count == 0
  Auction.create(name: 'SP Reverse Auction',
                 start_datetime: nil,
                 contract_period_start_date: nil,
                 contract_period_end_date: nil,
                 duration: nil,
                 reserve_price: nil,
                 total_volume: 6_805_584,
                 total_lt_peak: 2_361_990,
                 total_lt_off_peak: 1_574_664,
                 total_hts_peak: 37_452,
                 total_hts_off_peak: 56_046,
                 total_htl_peak: 1_983_720,
                 total_htl_off_peak: 791_712)
end

if Arrangement.count == 0
  Arrangement.create(main_name: '',
                     main_email_address: '',
                     main_mobile_number: '',
                     main_office_number: '',
                     lt_peak: nil,
                     lt_off_peak: nil,
                     hts_peak: nil,
                     hts_off_peak: nil,
                     htl_peak: nil,
                     htl_off_peak: nil,
                     accept_status: '2',
                     user_id: 2,
                     auction_id: 1)
  Arrangement.create(main_name: '',
                     main_email_address: '',
                     main_mobile_number: '',
                     main_office_number: '',
                     lt_peak: nil,
                     lt_off_peak: nil,
                     hts_peak: nil,
                     hts_off_peak: nil,
                     htl_peak: nil,
                     htl_off_peak: nil,
                     accept_status: '2',
                     user_id: 3,
                     auction_id: 1)
  Arrangement.create(main_name: '',
                     main_email_address: '',
                     main_mobile_number: '',
                     main_office_number: '',
                     lt_peak: nil,
                     lt_off_peak: nil,
                     hts_peak: nil,
                     hts_off_peak: nil,
                     htl_peak: nil,
                     htl_off_peak: nil,
                     accept_status: '2',
                     user_id: 4,
                     auction_id: 1)
  Arrangement.create(main_name: '',
                     main_email_address: '',
                     main_mobile_number: '',
                     main_office_number: '',
                     lt_peak: nil,
                     lt_off_peak: nil,
                     hts_peak: nil,
                     hts_off_peak: nil,
                     htl_peak: nil,
                     htl_off_peak: nil,
                     accept_status: '2',
                     user_id: 5,
                     auction_id: 1)
  Arrangement.create(main_name: '',
                     main_email_address: '',
                     main_mobile_number: '',
                     main_office_number: '',
                     lt_peak: nil,
                     lt_off_peak: nil,
                     hts_peak: nil,
                     hts_off_peak: nil,
                     htl_peak: nil,
                     htl_off_peak: nil,
                     accept_status: '2',
                     user_id: 6,
                     auction_id: 1)
end
