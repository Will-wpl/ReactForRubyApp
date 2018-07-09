class AddNewFieldsToConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :consumption_details, :existing_plan, :string
    add_column :consumption_details, :contract_expiry, :string
    add_column :consumption_details, :blk_or_unit, :string
    add_column :consumption_details, :street, :string
    add_column :consumption_details, :unit_number, :string
    add_column :consumption_details, :postal_code, :string
    add_column :consumption_details, :totals, :decimal
    add_column :consumption_details, :peak_pct, :decimal
    add_reference :consumption_details, :company_buyer_entity, index: true, foreign_key: true
    add_reference :consumption_details, :user_attachment, index: true, foreign_key: true
  end
end
