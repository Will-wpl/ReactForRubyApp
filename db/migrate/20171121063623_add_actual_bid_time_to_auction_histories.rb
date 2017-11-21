class AddActualBidTimeToAuctionHistories < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :actual_bid_time, :datetime
  end
end
