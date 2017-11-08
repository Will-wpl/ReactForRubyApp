class CreateAuctionExtendTimes < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_extend_times do |t|
      t.datetime :extend_time
      t.datetime :current_time
      t.datetime :actual_begin_time
      t.datetime :actual_end_time
      t.belongs_to :user, index: true
      t.belongs_to :auction, index: true
      t.timestamps
    end
  end
end
