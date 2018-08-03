class CreateAuctionContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_contracts do |t|
      t.string :contract_duration
      t.date :contract_period_end_date

      t.decimal :total_volume
      t.decimal :total_lt_peak
      t.decimal :total_lt_off_peak
      t.decimal :total_hts_peak
      t.decimal :total_hts_off_peak
      t.decimal :total_htl_peak
      t.decimal :total_htl_off_peak
      t.decimal :total_eht_peak
      t.decimal :total_eht_off_peak

      t.decimal :starting_price_lt_peak
      t.decimal :starting_price_lt_off_peak
      t.decimal :starting_price_hts_peak
      t.decimal :starting_price_hts_off_peak
      t.decimal :starting_price_htl_peak
      t.decimal :starting_price_htl_off_peak
      t.decimal :starting_price_eht_peak
      t.decimal :starting_price_eht_off_peak

      t.decimal :reserve_price_lt_peak
      t.decimal :reserve_price_lt_off_peak
      t.decimal :reserve_price_hts_peak
      t.decimal :reserve_price_hts_off_peak
      t.decimal :reserve_price_htl_peak
      t.decimal :reserve_price_htl_off_peak
      t.decimal :reserve_price_eht_peak
      t.decimal :reserve_price_eht_off_peak
      t.timestamps
    end
  end
end
