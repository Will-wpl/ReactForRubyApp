class CreateAuctionResults < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_results do |t|
      t.decimal :reserve_price
      t.decimal :lowest_average_price
      t.string :status
      t.string :lowest_price_bidder
      t.date :contract_period_start_date
      t.date :contract_period_end_date
      t.decimal :total_volume
      t.decimal :total_award_sum
      t.decimal :lt_peak
      t.decimal :lt_off_peak
      t.decimal :hts_peak
      t.decimal :hts_off_peak
      t.decimal :htl_peak
      t.decimal :htl_off_peak
      t.references :user
      t.references :auction, foreign_key: true

      t.timestamps
    end
  end
end
