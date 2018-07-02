class AddUserAttachments < ActiveRecord::Migration[5.1]
  def change
    create_table :user_attachments do |t|
      t.string :file_type
      t.string :file_name
      t.string :file_path
      t.timestamps

      t.belongs_to :user, index: true
    end
  end
end
