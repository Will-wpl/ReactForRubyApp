class UpdateFieldToTenderChatDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :tender_chat_details, :propose_deviation, :string
    remove_column :tender_chats, :propose_deviation, :string
  end
end
