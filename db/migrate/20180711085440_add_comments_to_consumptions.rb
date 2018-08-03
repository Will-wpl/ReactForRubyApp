class AddCommentsToConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :comments, :string
  end
end
