class AddFexibleToRequestAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :request_auctions, :fexible, :string
  end
end
