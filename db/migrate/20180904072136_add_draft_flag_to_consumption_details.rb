class AddDraftFlagToConsumptionDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :consumption_details, :draft_flag, :integer
  end
end
