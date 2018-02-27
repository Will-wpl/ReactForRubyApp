class AddAcknowledgeToConsumptions < ActiveRecord::Migration[5.1]
  def change
    add_column :consumptions, :acknowledge, :string
  end
end
