class AddTcAttachmentFlagToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :tc_attachment_update_flag, :int
  end
end
