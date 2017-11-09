class CreateUserExtensions < ActiveRecord::Migration[5.1]
  def change
    create_table :user_extensions do |t|
      t.string :login_status
      t.string :current_room
      t.string :current_page
      t.belongs_to :user, index: true, foreign_key: true
          t.timestamps
    end
  end
end
