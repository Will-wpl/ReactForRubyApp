class RemoveNewFieldsFromAuctionResult < ActiveRecord::Migration[5.1]
  def change
    remove_column :auction_results,  :reserve_price_lt_peak, :decimal
    remove_column :auction_results,  :reserve_price_lt_off_peak, :decimal
    remove_column :auction_results,  :reserve_price_hts_peak, :decimal
    remove_column :auction_results,  :reserve_price_hts_off_peak, :decimal
    remove_column :auction_results,  :reserve_price_htl_peak, :decimal
    remove_column :auction_results,  :reserve_price_htl_off_peak, :decimal
    remove_column :auction_results,  :reserve_price_eht_peak, :decimal
    remove_column :auction_results,  :reserve_price_eht_off_peak, :decimal
    remove_column :auction_results,  :contract_duration, :string
  end
end
