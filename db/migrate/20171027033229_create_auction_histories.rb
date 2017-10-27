class CreateAuctionHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_histories do |t|
      t.decimal :average_price
      t.decimal :lt_peak
      t.decimal :lt_off_peak
      t.decimal :hts_peak
      t.decimal :hts_off_peak
      t.decimal :htl_peak
      t.decimal :htl_off_peak
      t.datetime :bid_time
      t.references :user, foreign_key: true, index: true
      t.references :auction, foreign_key: true, index: true

      t.timestamps
    end
  end
end
