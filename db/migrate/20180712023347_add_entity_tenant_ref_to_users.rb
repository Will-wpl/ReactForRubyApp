class AddEntityTenantRefToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :entity_id, :bigint
    add_column :users, :tenant_id, :bigint
  end
end
