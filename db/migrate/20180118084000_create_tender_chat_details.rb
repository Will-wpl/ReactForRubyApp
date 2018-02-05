class CreateTenderChatDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :tender_chat_details do |t|
      t.string :retailer_response
      t.string :sp_response
      t.references :tender_chat, index: true
      t.timestamps
    end
  end
end
