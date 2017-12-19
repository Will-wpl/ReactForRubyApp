class AddFieldToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :approval_status, :string, default: '0'
  end
end
