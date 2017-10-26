class CreateAuctions < ActiveRecord::Migration[5.1]
  def change
    create_table :auctions do |t|
      t.string :name, null: false
      t.datetime :start_datetime, null: false
      t.date :contract_period_start_date, null: false
      t.date :contract_period_end_date, null: false
      t.integer :duration, null: false
      t.decimal :reserve_price, null: false, precision: 5, scale: 4

      t.timestamps
    end
  end
end
