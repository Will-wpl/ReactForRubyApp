class AddFieldsToAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :total_lt_peak, :decimal
    add_column :auctions, :total_lt_off_peak, :decimal
    add_column :auctions, :total_hts_peak, :decimal
    add_column :auctions, :total_hts_off_peak, :decimal
    add_column :auctions, :total_htl_peak, :decimal
    add_column :auctions, :total_htl_off_peak, :decimal
  end
end
