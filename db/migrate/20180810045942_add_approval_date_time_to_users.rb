class AddApprovalDateTimeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :approval_date_time, :datetime
  end
end
