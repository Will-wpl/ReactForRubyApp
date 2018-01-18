class CreateTenderChats < ActiveRecord::Migration[5.1]
  def change
    create_table :tender_chats do |t|
      t.integer :item
      t.string :clause
      t.string :propose_deviation
      t.string :sp_response_status
      t.references :arrangement, index: true
      t.timestamps
    end
  end
end
