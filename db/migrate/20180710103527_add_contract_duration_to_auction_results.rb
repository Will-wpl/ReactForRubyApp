class AddContractDurationToAuctionResults < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_results, :contract_duration, :string
  end
end
