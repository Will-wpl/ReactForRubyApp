admin_user = User.find_or_create_by(name: 'admin') do |user|
  user.email = 'revv@spgroup.com.sg'
  user.password = 'RA2017revv'
  user.password_confirmation = 'RA2017revv'
  user.company_name = 'SP GROUP'
end
admin_user.add_role :admin

Role.first_or_create(name: 'retailer')
Role.first_or_create(name: 'buyer')

reverse_auction = Auction.find_or_create_by(name: 'SP Reverse Auction') do |auction|
  auction.start_datetime = nil
  auction.contract_period_start_date = nil
  auction.contract_period_end_date = nil
  auction.duration = nil
  auction.reserve_price = nil
  auction.total_volume = nil # TBD SP provide six volumes 6_805_584
  auction.total_lt_peak = 2_468_375
  auction.total_lt_off_peak = 1_544_695
  auction.total_hts_peak = 0
  auction.total_hts_off_peak = 0
  auction.total_htl_peak = 1_983_720
  auction.total_htl_off_peak = 791_712
  auction.publish_status = '0'
end

retailers = [
  { name: 'Best Electricity Supply ', email: 'jichong@bestelectricity.com.sg', company_name: 'Best Electricity Supply', password: '8Qd3Xk7A' },
  { name: 'Charis Electric', email: 'kenneth.lee@chariselectric.com.sg', company_name: 'Charis Electric', password: '4F93Za4V'  },
  { name: 'Energy Supply Solutions', email: 'yap@energysupplysolutions.com.sg', company_name: 'Energy Supply Solutions', password: '5Qq2Qy8E'  },
  { name: 'Hyflux Energy', email: 'huixin_tang@hyflux.com', company_name: 'Hyflux Energy', password: '2Cy7Fw5J'  },
  { name: 'I Switch', email: 'Jovan.tang@iswitch.com.sg', company_name: 'I Switch', password: '9Fr6Yt4G'  },
  { name: 'Keppel Electric', email: 'peiling.liew@kepinfra.com', company_name: 'Keppel Electric', password: '6Yz3Pd7Z'  },
  { name: 'PacificLight Energy', email: 'Eugene.he@pacificlight.com.sg', company_name: 'PacificLight Energy', password: '7Tr5Au2Q'  },
  { name: 'Red Dot Power', email: 'hafizah.ahmad@reddotpower.com.sg', company_name: 'Red Dot Power', password: '6Pc9Qk7S'  },
  { name: 'SembCorp Power', email: 'jenny.lye@sembcorp.com', company_name: 'SembCorp Power', password: '2Uk6Cr7G'  },
  { name: 'Sunseap Energy', email: 'Ryan.Ang@sunseap.com', company_name: 'Sunseap Energy', password: '5Ve6Ay9J'  },
  { name: 'Tuas Power Supply', email: 'charlainechan@tuaspower.com.sg', company_name: 'Tuas Power Supply', password: '8Qk3Mk5L'  },
  { name: 'Union Power', email: 'Hermann@UnionPower.com.sg', company_name: 'Union Power', password: '6Yp9Uq3Y' }

]

retailers.each do |retailer|
  retail_user = User.find_or_create_by(email: retailer[:email]) do |retail_user|
    retail_user.name = retailer[:name]
    retail_user.company_name = retailer[:company_name]
    retail_user.password = retailer[:password]
    retail_user.password_confirmation = retailer[:password]
  end
  retail_user.add_role :retailer

  Arrangement.where(user: retail_user, auction: reverse_auction).first_or_create do |arrangement|
    arrangement.main_name = ''
    arrangement.main_email_address = ''
    arrangement.main_mobile_number = ''
    arrangement.main_office_number = ''
    arrangement.lt_peak = nil
    arrangement.lt_off_peak = nil
    arrangement.hts_peak = nil
    arrangement.hts_off_peak = nil
    arrangement.htl_peak = nil
    arrangement.htl_off_peak = nil
    arrangement.accept_status = '2'
  end
end

_unused_retailers = [
  { name: 'Cleantech Solar Management Company', email: 'contact@cleantechsolar.com', company_name: 'Cleantech Solar Management Company' },
  { name: 'Diamond Energy Merchants', email: 'dekay@diamond-energy.com.sg', company_name: 'Diamond Energy Merchants' },
  { name: 'Environmental Solutions (Asia)', email: 'info@env-solutions.com', company_name: 'Environmental Solutions (Asia)' },
  { name: 'Just Electric', email: 'jeffrey.ng@justelectric.sg', company_name: 'Just Electric' },
  { name: 'Ohm Energy', email: 'info@burienergy.com', company_name: 'Ohm Energy' },
  { name: 'Senoko Energy Supply', email: 'dylanng@senokoenergy.com', company_name: 'Senoko Energy Supply' },
  { name: 'Keppel Electric Mark', email: 'mark@example.com', company_name: 'Keppel Electric Mark' },
  { name: 'SembCorp Power Brian', email: 'brian@example.com', company_name: 'SembCorp Power Brian' },
  { name: 'Tuas Power Supply Jason', email: 'jason@example.com', company_name: 'Tuas Power Supply Jason' },
  { name: 'Senoko Energy Supply Will', email: 'will@example.com', company_name: 'Senoko Energy Supply Will' },
  { name: 'Cleantech Solar Management Company Judy', email: 'judy@example.com', company_name: 'Cleantech Solar Management Company Judy' }
]
