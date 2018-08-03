class AddRegisterFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :agree_seller_buyer, :string
    add_column :users, :agree_buyer_revv, :string
    add_column :users, :agree_seller_revv, :string
    add_column :users, :has_tenants, :string
    add_column :users, :changed_contract, :string

  end
end
