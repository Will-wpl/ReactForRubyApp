class RenameComsumptionToConsumption < ActiveRecord::Migration[5.1]
  def change
    rename_table :comsumptions, :consumptions
  end
end
