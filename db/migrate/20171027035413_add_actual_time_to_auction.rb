class AddActualTimeToAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :actual_begin_time, :datetime
    add_column :auctions, :actual_end_time, :datetime
  end
end
