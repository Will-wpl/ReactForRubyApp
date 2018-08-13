class AddConsumptionDetailIdToUserAttachments < ActiveRecord::Migration[5.1]
  def change
    add_column :user_attachments, :consumption_detail_id, :bigint
  end
end
