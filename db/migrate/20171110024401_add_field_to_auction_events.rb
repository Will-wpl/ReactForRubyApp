class AddFieldToAuctionEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_events, :auction_do, :string
    remove_column :auction_events, :auction_who, :string
  end
end
