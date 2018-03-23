class AddFileSourceToAuctionAttachments < ActiveRecord::Migration[5.1]
  def change
    add_reference :auction_attachments, :user, index: true
  end
end
