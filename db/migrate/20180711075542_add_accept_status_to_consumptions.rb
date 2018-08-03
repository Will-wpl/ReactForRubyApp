class AddAcceptStatusToConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :accept_status, :string
  end
end
