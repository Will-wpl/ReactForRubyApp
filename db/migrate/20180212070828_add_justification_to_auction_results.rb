class AddJustificationToAuctionResults < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_results, :justification, :string
  end
end
