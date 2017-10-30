class AddFieldsToAuctionHistories < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :is_bidder, :boolean
  end
end
