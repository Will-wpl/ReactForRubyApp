class AddReservePricesToAuctionResults < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_results,  :reserve_price_lt_peak, :decimal
    add_column :auction_results,  :reserve_price_lt_off_peak, :decimal
    add_column :auction_results,  :reserve_price_hts_peak, :decimal
    add_column :auction_results,  :reserve_price_hts_off_peak, :decimal
    add_column :auction_results,  :reserve_price_htl_peak, :decimal
    add_column :auction_results,  :reserve_price_htl_off_peak, :decimal
    add_column :auction_results,  :reserve_price_eht_peak, :decimal
    add_column :auction_results,  :reserve_price_eht_off_peak, :decimal
  end
end
