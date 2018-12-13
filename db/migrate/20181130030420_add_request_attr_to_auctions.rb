class AddRequestAttrToAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :is_saved, :bigint
    add_reference :auctions, :request_auction
  end
end
