class AddTotalAwardSumToAuctionHistory < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :total_award_sum, :string
  end
end
