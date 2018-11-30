class AddRequestOwnerIdToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :request_owner_id, :bigint
  end
end
