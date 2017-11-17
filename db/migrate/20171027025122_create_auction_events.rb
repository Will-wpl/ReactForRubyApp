class CreateAuctionEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_events do |t|
      t.string :auction_who
      t.datetime :auction_when
      t.text :auction_what

      t.timestamps
    end
  end
end
