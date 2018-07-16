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

email_templates = [
    {name: 'Retailer registration', subject: 'REVV account', body: 'Dear Admin,<br/><br/>#user.company_name has registered for a REVV account. <br/><br/>Please proceed to approve/reject the registration at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '1'},
    {name: 'Admin approve Retailer registration', subject: 'REVV account registration has been approved', body: 'Dear #user.company_name,<br/><br/>Congratulations, your REVV account registration has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '2'},
    {name: 'Admin reject Retailer registration', subject: 'REVV account registration has been rejected', body: 'Dear #user.company_name,<br/><br/>Your REVV account registration has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Kindly access your account registration page at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '3'},
    {name: 'Buyer invitation', subject: 'You are invited to participate in an upcoming auction', body: 'Dear #buyer.name,<br/><br/>You are invited to participate in an upcoming auction for aggregated electricity purchase. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '4'},
    {name: 'Retailer Invitation', subject: 'An auction for aggregated electricity purchase has been published', body: 'Dear #user.company_name,<br/><br/>An auction for aggregated electricity purchase has been published. You are invited to bid in this auction. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '5'},
    {name: 'Retailer Dashboard (submit tender documents)', subject: '#user.company_name has submitted their tender documents', body: 'Dear Admin,<br/><br/>#user.company_name has submitted their tender documents. <br/><br/>Please proceed to approve/reject the tender documents submission at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '6'},
    {name: 'Retailer Dashboard (Admin approve tender document)', subject: 'Your tender documents submission has been approved', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a> to submit the contact person details for actual day of bidding. <br/>', template_type: '7'},
    {name: 'Retailer Dashboard (Admin reject tender document)', subject: 'Your tender documents submission has been rejected', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.<br/>', template_type: '8'},
    {name: 'Admin responded deviation request', subject:'Admin has responded to your deviation request.', body:'Dear #user.company_name,<br/><br/>Admin has responded to your deviation request.<br/><br/>Please proceed to view the response and manage deviation request at <a href="http://revv.sg">revv.sg</a>.', template_type: '9'},
    {name: 'Winner confirmation', subject:'Winner confirmation', body:'Dear #retailer_company_name,<br/><br/>Congratulations, #retailer_company_name has been awarded the tender for #months electricity purchase category under the reverse auction conducted on #date_of_ra] (ID: #ra_id).<br/><br/>Please proceed to acknowledge the Letter(s) of Award at <a href="http://revv.sg">revv.sg</a>.', template_type: '10'},
    {name: 'Buyer registeration', subject:'Buyer registeration', body:'Dear Admin,<br/><br/>#buyer_company_name has registered for a REVV account.<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '11'},
    {name: 'CSV and PDF files upload', subject:'CSV and PDF files upload', body:'Dear #buyer_company_name,<br/><br/>Admin has uploaded the (i) tenant account details and (ii) Master - Tenant Agreement. <br/><br/>Please proceed to accept/reject at <a href="http://revv.sg">revv.sg</a>.', template_type: '12'},
    {name: 'Accept CSV and PDF files', subject:'Accept CSV and PDF files', body:'Dear Admin,<br/><br/>#buyer_company_name has accepted your tenant file uploads.<br/><br/>Comments: #comments<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '13'},
    {name: 'Reject CSV and PDF files', subject:'Reject CSV and PDF files', body:'Dear Admin,<br/><br/>#buyer_company_name has rejected your tenant file uploads.<br/><br/>Comments: #comments<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '14'},
    {name: 'Tenant account inform', subject:'Tenant account inform', body:'Dear #tenant_company_name,<br/><br/>A REVV account has been created for you by #buyer_company_name for electricity bill management.<br/><br/>REVV account log-in details:<br/>Email: #tenant_email<br/>Default Password: #password<br/><br/>You may now log in to your account and proceed to change your default passport at <a href="http://revv.sg">revv.sg</a>.', template_type: '15'},
    {name: 'Buyer change tenant information(1)', subject:'Buyer change tenant information(1)', body:'Dear Admin,<br/><br/>#buyer_company_name has raised a change request in the tenant details.<br/><br/>Please proceed to approve/reject the change request at <a href="http://revv.sg">revv.sg</a>.', template_type: '16'},
    {name: 'Buyer change tenant information(2)', subject:'Buyer change tenant information(2)', body:'Dear Admin,<br/><br/>#buyer_company_name has made amendments to the following fields for tenant: #tenant_name<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '17'},
    {name: 'Buyer change tenant information(3)', subject:'Buyer change tenant information(3)', body:'Dear #tenant_company_name],<br/><br/>#buyer_company_name has made amendments to the following fields for tenant: #tenant_name<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '18'},
    {name: 'Admin approve tenant infor change', subject:'Admin approve tenant infor change', body:'Dear #buyer_company_name],<br/><br/>Your tenant details change request has been approved.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '19'},
    {name: 'Admin reject tenant infor change', subject:'Admin reject tenant infor change', body:'Dear #buyer_company name,<br/><br/>Your tenant details change request has been rejected.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '20'},
    {name: 'Tenant change (to Admin)', subject:'Tenant change', body:'Dear Admin,<br/><br/>#tenant_company_name has made amendments to the following fields:<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details. ', template_type: '21'},
    {name: 'Tenant change (to Buyer)', subject:'Tenant change', body:'Dear #buyer_company_name,<br/><br/>#tenant_company_name has made amendments to the following fields:<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details. ', template_type: '22'},
    {name: 'Admin add new tenant accounts', subject:'Admin add new tenant accounts', body:'Dear #buyer_company_name,<br/><br/>Admin has added new tenant accounts. <br/><br/>Please proceed to accept/reject the new tenant accounts at <a href="http://revv.sg">revv.sg</a>.', template_type: '23'},
    {name: 'Buyer accept new added tenant accounts', subject:'Buyer accept new added tenant accounts', body:'Dear Admin,<br/><br/>#buyer_company_name has accepted the new tenant account details.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '24'},
    {name: 'Buyer reject new added tenant accounts', subject:'Buyer reject new added tenant accounts', body:'Dear Admin,<br/><br/>#buyer_company_name has rejected the new tenant account details.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '25'},

]

EmailTemplate.all.delete_all
email_templates.each do |template|
  EmailTemplate.find_or_create_by(template_type: template[:template_type]) do |this_template|
    this_template.name = template[:name]
    this_template.subject = template[:subject]
    this_template.body = template[:body]
    this_template.template_type = template[:template_type]

  end

end