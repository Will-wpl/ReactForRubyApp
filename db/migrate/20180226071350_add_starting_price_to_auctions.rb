class AddStartingPriceToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :starting_price, :decimal
  end
end
