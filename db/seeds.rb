require 'date'
if User.count == 0
  @admin = User.create(name: 'admin',
                       email: 'admin@example.com',
                       password: 'password',
                       password_confirmation: 'password',
                       company_name: 'SP GROUP')

  @admin.add_role :admin
  Role.create(name: 'retailer')
  Role.create(name: 'buyer')

  @retailer1 = User.create(name: 'Best Electricity Supply ',
                           email: 'enquiry@bestelectricity.com.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Best Electricity Supply')
  @retailer1.add_role :retailer

  @retailer2 = User.create(name: 'Charis Electric',
                           email: 'Kenneth.lee@chariselectric.com.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Charis Electric')
  @retailer2.add_role :retailer

  @retailer3 = User.create(name: 'Cleantech Solar Management Company',
                           email: 'contact@cleantechsolar.com',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Cleantech Solar Management Company')
  @retailer3.add_role :retailer

  @retailer4 = User.create(name: 'Diamond Energy Merchants',
                           email: 'dekay@diamond-energy.com.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Diamond Energy Merchants')
  @retailer4.add_role :retailer

  @retailer5 = User.create(name: 'Energy Supply Solutions',
                           email: 'lim@energysupplysolutions.com.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Energy Supply Solutions')
  @retailer5.add_role :retailer

  @retailer6 = User.create(name: 'Environmental Solutions (Asia)',
                           email: 'info@env-solutions.com',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Environmental Solutions (Asia)')
  @retailer6.add_role :retailer

  @retailer7 = User.create(name: 'Hyflux Energy',
                           email: 'Huixin_tang@hyflux.com',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Hyflux Energy')
  @retailer7.add_role :retailer

  @retailer8 = User.create(name: 'I Switch',
                           email: 'Senthil.kumar@iswitch.com.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'I Switch')
  @retailer8.add_role :retailer

  @retailer9 = User.create(name: 'Just Electric',
                           email: 'jeffrey.ng@justelectric.sg',
                           password: 'password',
                           password_confirmation: 'password',
                           company_name: 'Just Electric')
  @retailer9.add_role :retailer

  @retailer10 = User.create(name: 'Keppel Electric',
                            email: 'Peiling.liew@kepinfra.com',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Keppel Electric')
  @retailer10.add_role :retailer

  @retailer11 = User.create(name: 'Ohm Energy',
                            email: 'info@burienergy.com',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Ohm Energy')
  @retailer11.add_role :retailer

  @retailer12 = User.create(name: 'PacificLight Energy',
                            email: 'eugene.he@pacificlight.com.sg',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'PacificLight Energy')
  @retailer12.add_role :retailer

  @retailer13 = User.create(name: 'Red Dot Power',
                            email: 'hafizah.ahmad@reddotpower.com.sg',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Red Dot Power')
  @retailer13.add_role :retailer

  @retailer14 = User.create(name: 'SembCorp Power',
                            email: 'Jenny.lye@sembcorp.com',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'SembCorp Power')
  @retailer14.add_role :retailer

  @retailer15 = User.create(name: 'Senoko Energy Supply',
                            email: 'dylanng@senokoenergy.com',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Senoko Energy Supply')
  @retailer15.add_role :retailer

  @retailer16 = User.create(name: 'Seraya Energy',
                            email: 'lamkl@pseraya.com.sg',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Seraya Energy')
  @retailer16.add_role :retailer

  @retailer17 = User.create(name: 'Sunseap Energy',
                            email: 'Darius.kok@sunseap.com',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Sunseap Energy')
  @retailer17.add_role :retailer

  @retailer18 = User.create(name: 'Tuas Power Supply',
                            email: 'angiebai@tuaspower.com.sg',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Tuas Power Supply')
  @retailer18.add_role :retailer

  @retailer19 = User.create(name: 'Union Power',
                            email: 'hermann@unionpower.com.sg',
                            password: 'password',
                            password_confirmation: 'password',
                            company_name: 'Union Power')
  @retailer19.add_role :retailer

  # @mark = User.create(name: 'Keppel Electric Mark',
  #                     email: 'mark@example.com',
  #                     password: 'password',
  #                     password_confirmation: 'password',
  #                     company_name: 'Keppel Electric Mark')
  # @mark.add_role :retailer
  #
  # @brian = User.create(name: 'SembCorp Power Brian',
  #                      email: 'brian@example.com',
  #                      password: 'password',
  #                      password_confirmation: 'password',
  #                      company_name: 'SembCorp Power Brian')
  # @brian.add_role :retailer
  #
  # @jason = User.create(name: 'Tuas Power Supply Jason',
  #                      email: 'jason@example.com',
  #                      password: 'password',
  #                      password_confirmation: 'password',
  #                      company_name: 'Tuas Power Supply Jason')
  # @jason.add_role :retailer
  #
  # @will = User.create(name: 'Senoko Energy Supply Will',
  #                     email: 'will@example.com',
  #                     password: 'password',
  #                     password_confirmation: 'password',
  #                     company_name: 'Senoko Energy Supply Will')
  # @will.add_role :retailer
  #
  # @judy = User.create(name: 'Cleantech Solar Management Company Judy',
  #                     email: 'judy@example.com',
  #                     password: 'password',
  #                     password_confirmation: 'password',
  #                     company_name: 'Cleantech Solar Management Company Judy')
  # @judy.add_role :retailer

end

if Auction.count == 0
  Auction.create(name: 'SP Reverse Auction',
                 start_datetime: nil,
                 contract_period_start_date: nil,
                 contract_period_end_date: nil,
                 duration: nil,
                 reserve_price: nil,
                 total_volume: nil, # TBD SP provide six volumes 6_805_584,
                 total_lt_peak: 411_396,
                 total_lt_off_peak: 257_449,
                 total_hts_peak: 0,
                 total_hts_off_peak: 0,
                 total_htl_peak: 330_620,
                 total_htl_off_peak: 131_952,
                 publish_status: '0')
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
                     user_id: 7,
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
                     user_id: 8,
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
                     user_id: 9,
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
                     user_id: 10,
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
                     user_id: 11,
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
                     user_id: 12,
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
                     user_id: 13,
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
                     user_id: 14,
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
                     user_id: 15,
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
                     user_id: 16,
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
                     user_id: 17,
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
                     user_id: 18,
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
                     user_id: 19,
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
                     user_id: 20,
                     auction_id: 1)

  # Arrangement.create(main_name: '',
  #                    main_email_address: 'Mark1@123.com',
  #                    main_mobile_number: '12345678',
  #                    main_office_number: '12345678',
  #                    lt_peak: nil,
  #                    lt_off_peak: nil,
  #                    hts_peak: nil,
  #                    hts_off_peak: nil,
  #                    htl_peak: nil,
  #                    htl_off_peak: nil,
  #                    accept_status: '2',
  #                    user_id: 21,
  #                    auction_id: 1)
  # Arrangement.create(main_name: '',
  #                    main_email_address: 'Brian2@123.com',
  #                    main_mobile_number: '12345678',
  #                    main_office_number: '12345678',
  #                    lt_peak: nil,
  #                    lt_off_peak: nil,
  #                    hts_peak: nil,
  #                    hts_off_peak: nil,
  #                    htl_peak: nil,
  #                    htl_off_peak: nil,
  #                    accept_status: '2',
  #                    user_id: 22,
  #                    auction_id: 1)
  # Arrangement.create(main_name: '',
  #                    main_email_address: 'Jason3@163.com',
  #                    main_mobile_number: '12345678',
  #                    main_office_number: '12345678',
  #                    lt_peak: nil,
  #                    lt_off_peak: nil,
  #                    hts_peak: nil,
  #                    hts_off_peak: nil,
  #                    htl_peak: nil,
  #                    htl_off_peak: nil,
  #                    accept_status: '2',
  #                    user_id: 23,
  #                    auction_id: 1)
  # Arrangement.create(main_name: '',
  #                    main_email_address: 'Will4@163.com',
  #                    main_mobile_number: '12345678',
  #                    main_office_number: '12345678',
  #                    lt_peak: nil,
  #                    lt_off_peak: nil,
  #                    hts_peak: nil,
  #                    hts_off_peak: nil,
  #                    htl_peak: nil,
  #                    htl_off_peak: nil,
  #                    accept_status: '2',
  #                    user_id: 24,
  #                    auction_id: 1)
  # Arrangement.create(main_name: '',
  #                    main_email_address: 'Judy5@google.com',
  #                    main_mobile_number: '12345678',
  #                    main_office_number: '12345678',
  #                    lt_peak: nil,
  #                    lt_off_peak: nil,
  #                    hts_peak: nil,
  #                    hts_off_peak: nil,
  #                    htl_peak: nil,
  #                    htl_off_peak: nil,
  #                    accept_status: '2',
  #                    user_id: 25,
  #                    auction_id: 1)
end
