class TenderStateMachine < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :arrangement
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_arrangement_id, ->(arrangement_id) { where('arrangement_id = ?', arrangement_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.update_state_machine(arrangement_id, state_machine_params)
    tender_state_machine = TenderStateMachine.find_by_arrangement_id(arrangement_id)
    tender_state_machine.update(previous_node: state_machine_params[:previous_node],
                                current_node: state_machine_params[:current_node],
                                next_node: state_machine_params[:next_node],
                                turn_to: state_machine_params[:turn_to])
    if state_machine_params[:status] == 'reject'
      arrangement = Arrangement.find(arrangement_id)
      arrangement.update(accept_status: '0')
    elsif state_machine_params[:status] == 'closed'
      arrangement = Arrangement.find(arrangement_id)
      arrangement.update(accept_status: '1')
    end
  end
end
