class AddEhtField < ActiveRecord::Migration[5.1]
  def change
    add_column :arrangements, :eht_peak, :decimal
    add_column :arrangements, :eht_off_peak, :decimal

    add_column :auction_results, :eht_peak, :decimal
    add_column :auction_results, :eht_off_peak, :decimal

    add_column :auction_histories, :eht_peak, :decimal
    add_column :auction_histories, :eht_off_peak, :decimal

    add_column :consumptions, :eht_peak, :decimal
    add_column :consumptions, :eht_off_peak, :decimal

    add_column :auctions, :total_eht_peak, :decimal
    add_column :auctions, :total_eht_off_peak, :decimal
  end
end
