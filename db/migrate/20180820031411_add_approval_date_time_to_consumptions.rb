class AddApprovalDateTimeToConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :approval_date_time, :datetime
  end
end
