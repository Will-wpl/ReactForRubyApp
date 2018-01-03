class RenameComsumptionDetailToConsumptionDetail < ActiveRecord::Migration[5.1]
  def change
    rename_table :comsumption_details, :consumption_details
  end
end
