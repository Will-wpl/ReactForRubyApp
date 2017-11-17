class AddTotalVolumeToAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :total_volume, :decimal
  end
end
