class CreateConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :consumption_details do |t|
      t.string :account_number
      t.string :intake_level
      t.decimal :peak
      t.decimal :off_peak
      t.references :consumption, foreign_key: true, index: true
      t.timestamps
    end
  end
end
