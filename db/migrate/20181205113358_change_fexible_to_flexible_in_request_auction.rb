class ChangeFexibleToFlexibleInRequestAuction < ActiveRecord::Migration[5.1]
  def change
    remove_column :request_auctions, :fexible, :string
    add_column :request_auctions, :flexible, :string
  end
end
