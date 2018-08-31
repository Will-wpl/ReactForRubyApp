class AddIsDeletedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :is_deleted, :integer
    add_column :users, :deleted_at, :timestamp
  end
end
