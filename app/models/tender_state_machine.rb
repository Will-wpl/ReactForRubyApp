class TenderStateMachine < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :arrangement
  # accepts_nested_attributes

  # Validations

  # Scopes
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.add_state_machine(arrangement_id, state_machine_params)
    ActiveRecord::Base.transaction do
      TenderStateMachine.create(previous_node: state_machine_params[:previous_node],
                                current_node: state_machine_params[:current_node],
                                current_status: state_machine_params[:status],
                                turn_to_role: state_machine_params[:turn_to_role],
                                current_role: state_machine_params[:current_role],
                                arrangement_id: arrangement_id)
      arrangement = Arrangement.find(arrangement_id)
      if state_machine_params[:status] == 'reject'
        arrangement.update(accept_status: '0')
      elsif state_machine_params[:status] == 'closed'
        arrangement.update(accept_status: '1')
      else # pending
        arrangement.update(accept_status: '2')
      end
    end
  end

end
