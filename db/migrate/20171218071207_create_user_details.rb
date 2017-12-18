class CreateUserDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :user_details do |t|
      t.string :consumer_type
      t.string :company_address
      t.string :company_unique_entity_number
      t.string :account_fin
      t.string :account_mobile_number
      t.string :account_office_number
      t.string :account_home_number
      t.string :account_housing_type
      t.string :account_home_address
      t.belongs_to :user, index: true, foreign_key: true
      t.timestamps
    end
  end
end
