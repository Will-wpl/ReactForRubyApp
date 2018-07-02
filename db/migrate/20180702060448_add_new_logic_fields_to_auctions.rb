class AddNewLogicFieldsToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :starting_price_time, :integer
    add_column :auctions, :buyer_type, :string
    add_column :auctions, :allow_deviation, :string
  end
end
