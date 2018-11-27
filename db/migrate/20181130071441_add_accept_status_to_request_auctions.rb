class AddAcceptStatusToRequestAuctions < ActiveRecord::Migration[5.1]
  def change
    add_column :request_auctions, :accept_status, :string
  end
end
