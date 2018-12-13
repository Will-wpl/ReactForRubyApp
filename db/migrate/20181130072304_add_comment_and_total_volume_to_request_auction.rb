class AddCommentAndTotalVolumeToRequestAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :request_auctions, :comment, :string
    add_column :request_auctions, :total_volume, :bigint
    add_column :request_auctions, :auction_id, :bigint
  end
end
