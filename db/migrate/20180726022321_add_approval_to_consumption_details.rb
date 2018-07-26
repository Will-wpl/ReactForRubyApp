class AddApprovalToConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :consumption_details, :approval_status, :string
  end
end
