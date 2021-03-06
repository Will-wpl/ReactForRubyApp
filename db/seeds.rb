admin_user = User.find_or_create_by(name: 'admin') do |user|
  user.email = 'revv@spgroup.com.sg'
  user.password = 'password'
  user.password_confirmation = 'password'
  user.company_name = 'SP GROUP'
end
admin_user.add_role :admin

Role.find_or_create_by(name: 'retailer')
Role.find_or_create_by(name: 'buyer')
Role.find_or_create_by(name: 'entity')
Role.find_or_create_by(name: 'tenant')

User.all.update_all(approval_status: User::ApprovalStatusRegistering)

CompanyBuyerEntity.where('approval_status is null').update(approval_status: CompanyBuyerEntity::ApprovalStatusApproved)
# reverse_auction = Auction.find_or_create_by(name: 'SP Reverse Auction') do |auction|
#   auction.start_datetime = nil
#   auction.contract_period_start_date = nil
#   auction.contract_period_end_date = nil
#   auction.duration = nil
#   auction.reserve_price = nil
#   auction.total_volume = nil # TBD SP provide six volumes 6_805_584
#   auction.total_lt_peak = 2_468_375
#   auction.total_lt_off_peak = 1_544_695
#   auction.total_hts_peak = 0
#   auction.total_hts_off_peak = 0
#   auction.total_htl_peak = 1_983_720
#   auction.total_htl_off_peak = 791_712
#   auction.total_eht_peak = 0
#   auction.total_eht_off_peak = 0
#   auction.publish_status = '0'
# end


# comment testing account
=begin
retailers = [
    { name: 'Retailer 1', email: 'retailer1@example.com', company_name: 'Retailer1 Company', password: 'password',approval_status:'1'  }




  { name: 'Mark', email: 'Mark.Liu@chinasofti.com', company_name: 'Mark Electricity', password: 'password',approval_status:'1'  },
  { name: 'Jason', email: 'Jason.huang@chinasofti.com', company_name: 'Jason Electricity', password: 'password',approval_status:'1'  },
  { name: 'Judy', email: 'Judy.Zhu@chinasofti.com', company_name: 'Judy Electricity', password: 'password',approval_status:'1'  },
  { name: 'Yang Qingxin', email: 'yangqingxin@chinasofti.com', company_name: 'Yang Qingxin Electricity', password: 'password',approval_status:'1'  },
  { name: 'Wang Jingzhu', email: 'jingzhu.wang@chinasofti.com', company_name: 'Wang Jingzhu Electricity', password: 'password',approval_status:'1'  },
  { name: 'Will ', email: 'Will.wang@chinasofti.com', company_name: 'Will Electricity', password: 'password',approval_status:'1' },
  { name: 'Retailer 2', email: 'retailer2@example.com', company_name: 'Retailer2 Company', password: 'password',approval_status:'2' },
  { name: 'Retailer 3', email: 'retailer3@example.com', company_name: 'Retailer3 Company', password: 'password',approval_status:'2'  },
  { name: 'Retailer 4', email: 'retailer4@example.com', company_name: 'Retailer4 Company', password: 'password',approval_status:'2'  },
  { name: 'Retailer 5', email: 'retailer5@example.com', company_name: 'Retailer5 Company', password: 'password',approval_status:'0'  },
  { name: 'Retailer 6', email: 'retailer6@example.com', company_name: 'Retailer6 Company', password: 'password',approval_status:'0' }
]
=end


=begin
retailers.each do |retailer|
  retail_user = User.find_or_create_by(email: retailer[:email]) do |retail_user|
    retail_user.name = retailer[:name]
    retail_user.company_name = retailer[:company_name]
    retail_user.password = retailer[:password]
    retail_user.password_confirmation = retailer[:password]
    retail_user.approval_status = retailer[:approval_status]
    retail_user.company_address = 'China DL'
    retail_user.company_unique_entity_number = 'UEN 01234'
    retail_user.company_license_number = 'LICENSE 01234'
    retail_user.account_mobile_number = '12345678'
    retail_user.account_office_number = '87654321'
  end
  retail_user.add_role :retailer
end
=end



=begin
company_buyers = [
    { name: 'buyer1', email: 'cbuyer1@example.com', company_name: 'Company Buyer 1', password: 'password' }
#comment testing account
    { name: 'buyer2', email: 'cbuyer2@example.com', company_name: 'Company Buyer 2', password: 'password' },
    { name: 'buyer3', email: 'cbuyer3@example.com', company_name: 'Company Buyer 3', password: 'password' },
    { name: 'buyer4', email: 'cbuyer4@example.com', company_name: 'Company Buyer 4', password: 'password' },
    { name: 'buyer5', email: 'cbuyer5@example.com', company_name: 'Company Buyer 5', password: 'password' },
    { name: 'buyer6', email: 'cbuyer6@example.com', company_name: 'Company Buyer 6', password: 'password' },
    { name: 'buyer7', email: 'cbuyer7@example.com', company_name: 'Company Buyer 7', password: 'password' },
    { name: 'buyer8', email: 'cbuyer8@example.com', company_name: 'Company Buyer 8', password: 'password' },
    { name: 'buyer9', email: 'cbuyer9@example.com', company_name: 'Company Buyer 9', password: 'password' },
    { name: 'buyer10', email: 'cbuyer10@example.com', company_name: 'Company Buyer 10', password: 'password'}

]

company_buyers.each do |buyer|
    com_buyer = User.find_or_create_by(email: buyer[:email]) do |com_buyer|
        com_buyer.name = buyer[:name]
        com_buyer.company_name = buyer[:company_name]
        com_buyer.password = buyer[:password]
        com_buyer.password_confirmation = buyer[:password]
        com_buyer.consumer_type = '2'
        com_buyer.company_address = 'China DL'
        com_buyer.company_unique_entity_number = 'UEN 01234'
        com_buyer.account_mobile_number = '12345678'
        com_buyer.account_office_number = '87654321'
    end
    com_buyer.add_role :buyer

end
=end


# comment testing account
=begin
individual_buyers = [
    { name: 'individual buyer1', email: 'ibuyer1@example.com', account_housing_type: '0', password: 'password' }
#comment testing account
    { name: 'individual buyer2', email: 'ibuyer2@example.com', account_housing_type: '0', password: 'password' },
    { name: 'individual buyer3', email: 'ibuyer3@example.com', account_housing_type: '0', password: 'password' },
    { name: 'individual buyer4', email: 'ibuyer4@example.com', account_housing_type: '1', password: 'password' },
    { name: 'individual buyer5', email: 'ibuyer5@example.com', account_housing_type: '1', password: 'password' },
    { name: 'individual buyer6', email: 'ibuyer6@example.com', account_housing_type: '1', password: 'password' },
    { name: 'individual buyer7', email: 'ibuyer7@example.com', account_housing_type: '2', password: 'password' },
    { name: 'individual buyer8', email: 'ibuyer8@example.com', account_housing_type: '2', password: 'password' },
    { name: 'individual buyer9', email: 'ibuyer9@example.com', account_housing_type: '2', password: 'password' },
    { name: 'individual buyer10', email: 'ibuyer10@example.com', account_housing_type: '2', password: 'password'}

]

individual_buyers.each do |buyer|
  ind_buyer = User.find_or_create_by(email: buyer[:email]) do |ind_buyer|
    ind_buyer.name = buyer[:name]
    ind_buyer.account_housing_type = buyer[:account_housing_type]
    ind_buyer.password = buyer[:password]
    ind_buyer.password_confirmation = buyer[:password]
    ind_buyer.consumer_type = '3'
    ind_buyer.account_home_address = 'China DL'
    ind_buyer.account_fin = 'FIN 01234'
    ind_buyer.account_mobile_number = '12345678'
    ind_buyer.account_office_number = '87654321'
  end
  ind_buyer.add_role :buyer

end

=end

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

