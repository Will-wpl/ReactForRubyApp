class AddUserDetailsToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :approval_status, :string
    add_column :users, :consumer_type, :string
    add_column :users, :company_address, :string
    add_column :users, :company_unique_entity_number, :string
    add_column :users, :company_license_number, :string
    add_column :users, :account_fin, :string
    add_column :users, :account_mobile_number, :string
    add_column :users, :account_office_number, :string
    add_column :users, :account_home_number, :string
    add_column :users, :account_housing_type, :string
    add_column :users, :account_home_address, :string
  end
end
