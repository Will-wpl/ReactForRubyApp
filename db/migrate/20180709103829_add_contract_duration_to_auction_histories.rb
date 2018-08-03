class AddContractDurationToAuctionHistories < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :contract_duration, :string
  end
end
