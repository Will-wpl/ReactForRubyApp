class CreateAuctions < ActiveRecord::Migration[5.1]
  def change
    create_table :auctions do |t|
      t.string :name, null: true
      t.datetime :start_datetime, null: true
      t.date :contract_period_start_date, null: true
      t.date :contract_period_end_date, null: true
      t.integer :duration, null: true
      t.decimal :reserve_price, null: true, precision: 5, scale: 4

      t.timestamps
    end
  end
end
