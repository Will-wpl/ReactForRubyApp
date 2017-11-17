class AddFlagToAuctionHistories < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :flag, :string
  end
end
