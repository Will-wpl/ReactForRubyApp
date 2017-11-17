class RemoveLoginStatusToArrangements < ActiveRecord::Migration[5.1]
  def change
    remove_column :arrangements, :login_status, :string
  end
end
