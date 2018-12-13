class CreateRequestAuctions < ActiveRecord::Migration[5.1]
  def change
    create_table :request_auctions do |t|
      t.string :name, null: true
      t.date :contract_period_start_date, null: true
      t.integer :duration, null: true
      t.string :buyer_type
      t.string :allow_deviation
      t.references :user, foreign_key: true, index: true
      t.timestamps
    end
  end
end
