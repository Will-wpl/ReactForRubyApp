require 'engine/workflow'
require 'engine/node'
require 'engine/event'
class TenderWorkflow < Workflow

  def initialize
    # from 1 is admin , 2 is retailer
    @node1 = Node.new(:node1, 1, 'begin',
                      accept: Event.new(:accept, :node2, 2),
                      reject: Event.new(:reject, nil, 2))
    @node2 = Node.new(:node2, 2,'process',
                      accept_all: Event.new(:accept_all, :node4, 2),
                      propose_deviations: Event.new(:propose_deviations, :node3, 2))

    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 2),)
    super(node1: @node1, node2: @node2)
  end

  def execute(node_name, event_name, arrangement_id)
    node = find_node_by_name(node_name)
    event = node.find_event_by_name(event_name)
    state_machine = set_state_machine_by_rule(node, event)
    TenderStateMachine.update_state_machine(arrangement_id, state_machine)
    yield if block_given?
  end

  protected

  def set_state_machine_by_rule(node, event)
    state_machine = {}
    if node.status == 'begin'
      if event.transitions_to.nil?
        state_machine[:status] = 'reject'
      else
        state_machine = set_state_machine(node, event)
      end
    elsif node.status == 'end'
      if event.transitions_to.nil?
        state_machine[:status] = 'closed'
        state_machine[:previous_node] = node.code
        state_machine[:current_node] = node.code
      else
        state_machine = set_state_machine(node, event)
      end
    else
      state_machine = set_state_machine(node, event)
    end
    state_machine
  end

  private

  def set_state_machine(node, event)
    state_machine = {}
    state_machine[:previous_node] = node.code
    next_node = find_next_node(event)
    state_machine[:current_node] = next_node.code
    state_machine[:turn_to] = event.turn_to_role
    state_machine[:status] = next_node.status
    state_machine
  end

end