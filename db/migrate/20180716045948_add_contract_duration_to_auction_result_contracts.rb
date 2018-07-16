class AddContractDurationToAuctionResultContracts < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_result_contracts, :contract_duration, :string
  end
end
