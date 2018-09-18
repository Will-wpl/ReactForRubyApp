class RemoveTcAttachmentUpdateFlagFromUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :tc_attachment_update_flag, :int
  end
end
