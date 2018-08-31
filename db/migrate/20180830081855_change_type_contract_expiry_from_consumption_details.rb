class ChangeTypeContractExpiryFromConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    change_column :consumption_details, :contract_expiry, :date
  end
end
