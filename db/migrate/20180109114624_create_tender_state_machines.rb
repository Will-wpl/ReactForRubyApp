class CreateTenderStateMachines < ActiveRecord::Migration[5.1]
  def change
    create_table :tender_state_machines do |t|
      t.integer :previous_node
      t.integer :current_node
      t.string :current_status
      t.integer :turn_to
      t.references :arrangement, index: true
      t.timestamps
    end
  end
end
