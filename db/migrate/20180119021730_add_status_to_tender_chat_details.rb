class AddStatusToTenderChatDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :tender_chat_details, :response_status, :string
  end
end
