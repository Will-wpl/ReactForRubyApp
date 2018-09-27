namespace :user_log do
  desc "Buyer / Retailer log init"

  task :init => :environment do

    users = User.all
    users.each do |user|
      unless UserUpdatedLog.any? { |x| x.users_id == user.id }
        user_updated_log = UserUpdatedLog.new
        user_updated_log.name = user.name
        user_updated_log.email = user.email
        user_updated_log.company_name = user.company_name
        user_updated_log.approval_status = user.approval_status
        user_updated_log.consumer_type = user.consumer_type
        user_updated_log.company_address = user.company_address
        user_updated_log.company_unique_entity_number = user.company_unique_entity_number
        user_updated_log.company_license_number = user.company_license_number
        user_updated_log.account_fin = user.account_fin
        user_updated_log.account_mobile_number = user.account_mobile_number
        user_updated_log.account_office_number = user.account_office_number
        user_updated_log.account_home_number = user.account_home_number
        user_updated_log.account_housing_type = user.account_housing_type
        user_updated_log.account_home_address = user.account_home_address
        user_updated_log.comment = user.comment
        user_updated_log.billing_address = user.billing_address
        user_updated_log.gst_no = user.gst_no
        user_updated_log.created_at = user.created_at
        user_updated_log.users_id = user.id
        user_updated_log.save!
      end
    end
  end

end
