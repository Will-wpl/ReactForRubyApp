Rolify.configure do |config|
  # By default ORM adapter is ActiveRecord. uncomment to use mongoid
  # config.use_mongoid

  # Dynamic shortcuts for User class (user.is_admin? like methods). Default is: false
  # config.use_dynamic_shortcuts
end

if ActiveRecord::Migrator.get_all_versions.last == ActiveRecord::Migrator.current_version
  (%w[admin] - Role.pluck(:name)).each do |role_name|
    Role.create(name: role_name)
  end
end
