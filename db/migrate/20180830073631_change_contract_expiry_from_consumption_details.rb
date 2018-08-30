class ChangeContractExpiryFromConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    remove_column :consumption_details, :contract_expiry, :string
    add_column :consumption_details, :contract_expiry, :datetime
  end
end
