class AddForeignKeyToArrangement < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :arrangements, :users
    add_foreign_key :arrangements, :auctions
  end
end

