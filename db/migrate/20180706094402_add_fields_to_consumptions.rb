class AddFieldsToConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :contract_duration, :string
  end
end
