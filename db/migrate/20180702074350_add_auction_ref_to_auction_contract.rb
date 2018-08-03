class AddAuctionRefToAuctionContract < ActiveRecord::Migration[5.1]
  def change
    add_reference :auction_contracts, :auction, index: true, foreign_key: true
  end
end
