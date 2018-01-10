admin_user = User.find_or_create_by(name: 'admin') do |user|
  user.email = 'admin@example.com'
  user.password = 'password'
  user.password_confirmation = 'password'
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
  auction.total_eht_peak = 0
  auction.total_eht_off_peak = 0
  auction.publish_status = '0'
end

retailers = [
  { name: 'Best Electricity Supply ', email: 'Will.wang@chinasofti.com', company_name: 'Best Electricity Supply', password: 'password' },
  { name: 'Charis Electric', email: 'Mark.Liu@chinasofti.com', company_name: 'Charis Electric', password: 'password'  },
  { name: 'Energy Supply Solutions', email: 'Jason.huang@chinasofti.com', company_name: 'Energy Supply Solutions', password: 'password'  },
  { name: 'Hyflux Energy', email: 'Judy.Zhu@chinasofti.com', company_name: 'Hyflux Energy', password: 'password'  },
  { name: 'I Switch', email: 'yangqingxin@chinasofti.com', company_name: 'I Switch', password: 'password'  },
  { name: 'Dummy Retailer', email: 'jingzhu.wang@chinasofti.com', company_name: 'Dummy Retailer', password: 'password'  }
  # { name: 'PacificLight Energy', email: 'Eugene.he@pacificlight.com.sg', company_name: 'PacificLight Energy', password: 'password'  },
  # { name: 'Red Dot Power', email: 'hafizah.ahmad@reddotpower.com.sg', company_name: 'Red Dot Power', password: 'password'  },
  # { name: 'SembCorp Power', email: 'jenny.lye@sembcorp.com', company_name: 'SembCorp Power', password: 'password'  },
  # { name: 'Sunseap Energy', email: 'Ryan.Ang@sunseap.com', company_name: 'Sunseap Energy', password: 'password'  },
  # { name: 'Tuas Power Supply', email: 'charlainechan@tuaspower.com.sg', company_name: 'Tuas Power Supply', password: 'password'  },
  # { name: 'Union Power', email: 'Hermann@UnionPower.com.sg', company_name: 'Union Power', password: 'password' }

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

email_templates = [
    {subject: 'REVV account', body: 'Dear Admin,<br/><br/>#user.company_name has registered for a REVV account. <br/><br/>Please proceed to approve/reject the registration at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '1'},
    {subject: 'REVV account registration has been approved', body: 'Dear #user.company_name,<br/><br/>Congratulations, your REVV account registration has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '2'},
    {subject: 'REVV account registration has been rejected', body: 'Dear #user.company_name,<br/><br/>Your REVV account registration has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Kindly access your account registration page at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '3'},
    {subject: 'You are invited', body: 'Dear #buyer.name,<br/><br/>You are invited to participate in an upcoming auction for aggregated electricity purchase. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '4'},
    {subject: 'An auction for aggregated', body: 'Dear #user.company_name,<br/><br/>An auction for aggregated electricity purchase has been published. You are invited to bid in this auction. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '5'},
    {subject: '#user.company_name has submitted their tender documents', body: 'Dear Admin,<br/><br/>#user.company_name has submitted their tender documents. <br/><br/>Please proceed to approve/reject the tender documents submission at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '6'},
    {subject: 'Your tender documents submission has been approved', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a> to submit the contact person details for actual day of bidding. <br/>', template_type: '7'},
    {subject: 'Your tender documents submission has been rejected', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.<br/>', template_type: '8'}
]

email_templates.each do |template|
  email_template = EmailTemplate.find_or_create_by(template_type: template[:template_type]) do |this_template|
    this_template.subject = template[:subject]
    this_template.body = template[:body]
    this_template.template_type = template[:template_type]

  end
end