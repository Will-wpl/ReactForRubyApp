class SetRequestAuctionIdAsNullableInRequestAttachment < ActiveRecord::Migration[5.1]
  def change
    change_column_null :request_attachments, :request_auction_id, true
  end
end
