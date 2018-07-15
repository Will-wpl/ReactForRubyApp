class AddUserAndAuctionRefToAuctionResultContract < ActiveRecord::Migration[5.1]
  def change
    add_reference :auction_result_contracts, :auction, index: true, foreign_key: true
    add_reference :auction_result_contracts, :user, index: true
  end
end
