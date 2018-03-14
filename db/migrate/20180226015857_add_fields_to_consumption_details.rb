class AddFieldsToConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :consumption_details, :premise_address, :string
    add_column :consumption_details, :contracted_capacity, :decimal
  end
end
