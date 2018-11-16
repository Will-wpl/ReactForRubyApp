class AddTcAttachmentInfoToAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :auctions, :tc_attach_info, :text
  end
end
