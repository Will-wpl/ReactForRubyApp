class AddHoldStatusToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :hold_status, :boolean, default: false
  end
end
