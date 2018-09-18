class CreateUserUpdatedLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :user_updated_logs do |t|
      t.string "name"
      t.string "email", default: "", null: false
      t.string "company_name"
      t.string "approval_status"
      t.string "consumer_type"
      t.string "company_address"
      t.string "company_unique_entity_number"
      t.string "company_license_number"
      t.string "account_fin"
      t.string "account_mobile_number"
      t.string "account_office_number"
      t.string "account_home_number"
      t.string "account_housing_type"
      t.string "account_home_address"
      t.text "comment"
      t.string "billing_address"
      t.string "gst_no"
      t.datetime "created_at", null: false
      t.timestamps
      t.belongs_to :users
    end
  end
end
