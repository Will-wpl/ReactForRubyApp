class AddPublishedDateTimeToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :published_date_time, :datetime
  end
end
