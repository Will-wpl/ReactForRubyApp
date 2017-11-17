class AddPublishStatusToAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :publish_status, :string
    add_column :auctions, :published_gid, :string
  end
end
