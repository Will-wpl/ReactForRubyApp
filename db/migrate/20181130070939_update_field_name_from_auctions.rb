class UpdateFieldNameFromAuctions < ActiveRecord::Migration[5.1]
  def change
    remove_column :auctions, :is_saved, :bigint
    add_column :auctions, :accept_status, :string
  end
end
