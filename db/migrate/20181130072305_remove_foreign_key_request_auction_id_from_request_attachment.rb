class RemoveForeignKeyRequestAuctionIdFromRequestAttachment < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :request_attachments, column: :request_auction_id
  end
end
