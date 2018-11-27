class RemoveIndexOnRequestAuctionIdInRequestAttachment < ActiveRecord::Migration[5.1]
  def change
    remove_index :request_attachments, column: :request_auction_id
  end
end
