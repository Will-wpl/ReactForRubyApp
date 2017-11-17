class RemoveAndSetLoginStatusToArrangements < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :login_status, :string
    add_column :arrangements, :login_status, :string
  end
end
