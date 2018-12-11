class AddAcceptDateTimeToRequestAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :request_auctions, :accept_date_time, :timestamp
  end
end
