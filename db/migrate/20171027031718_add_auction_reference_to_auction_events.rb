class AddAuctionReferenceToAuctionEvents < ActiveRecord::Migration[5.1]
  def change
    add_reference :auction_events, :user, foreign_key: true, index: true
    add_reference :auction_events, :auction, foreign_key: true, index: true
  end
end
