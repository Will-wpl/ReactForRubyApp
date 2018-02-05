class AddActionStatusToArrangements < ActiveRecord::Migration[5.1]
  def change
    add_column :arrangements, :action_status, :string
  end
end
