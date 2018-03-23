class AddExtendFieldToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :time_extension, :string
    add_column :auctions, :average_price, :string
    add_column :auctions, :retailer_mode, :string
  end
end
