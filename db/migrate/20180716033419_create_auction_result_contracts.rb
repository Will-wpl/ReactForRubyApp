class CreateAuctionResultContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_result_contracts do |t|
      t.decimal :reserve_price
      t.decimal :lowest_average_price
      t.string :status
      t.string :lowest_price_bidder
      t.date :contract_period_end_date
      t.decimal :total_volume
      t.decimal :total_award_sum
      t.decimal :lt_peak
      t.decimal :lt_off_peak
      t.decimal :hts_peak
      t.decimal :hts_off_peak
      t.decimal :htl_peak
      t.decimal :htl_off_peak
      t.decimal :eht_peak
      t.decimal :eht_off_peak
      t.text :justification
      t.timestamps
      t.belongs_to :auction_result
    end
  end
end
