class CreateComsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :comsumption_details do |t|
      t.string :account_number
      t.string :intake_level
      t.decimal :peak
      t.decimal :off_peak
      t.references :comsumption, foreign_key: true, index: true
      t.timestamps
    end
  end
end
