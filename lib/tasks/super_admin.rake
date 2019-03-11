namespace :super_admin do
  desc 'super admin init'
  task init: :environment do
    Role.find_or_create_by(name: 'super_admin')
    super_admin = User.find_by_email('revv@spgroup.com.sg')
    super_admin.add_role :super_admin
  end
end
