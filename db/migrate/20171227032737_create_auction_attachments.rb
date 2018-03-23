class CreateAuctionAttachments < ActiveRecord::Migration[5.1]
  def change
    create_table :auction_attachments do |t|
      t.string :file_type
      t.string :file_name
      t.string :file_path
      t.references :auction, foreign_key: true, index: true
      t.timestamps
    end
  end
end
