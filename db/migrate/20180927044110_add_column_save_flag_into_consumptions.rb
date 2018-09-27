class AddColumnSaveFlagIntoConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :is_saved, :integer
  end
end
