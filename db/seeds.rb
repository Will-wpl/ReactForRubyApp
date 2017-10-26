if User.count == 0
  @admin = User.create(name: 'admin',
                     email: 'admin@example.com',
                     password: 'password',
                     password_confirmation: 'password')

  @admin.add_role :admin
  Role.create(name:'retailer')
  Role.create(name:'buyer')
end

if Auction.count == 0
  
end

