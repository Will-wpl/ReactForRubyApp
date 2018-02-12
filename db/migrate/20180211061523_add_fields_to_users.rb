class AddFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :billing_address, :string
    add_column :users, :gst_no, :string
  end
end
