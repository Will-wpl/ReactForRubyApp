class Workflow

  attr_reader :nodes

  def initialize(nodes)
    @nodes = nodes
  end

  def find_node_by_name(node_name)
    @nodes[node_name]
  end

  def find_previous_node(event)
    @nodes[event.transitions_to]
  end

  def find_next_node(event)
    @nodes[event.transitions_to]
  end

  protected

  def set_processing_state_machine(node, event)
    next_node = find_next_node(event)
    { previous_node: node.code, current_node: next_node.code, turn_to: event.turn_to_role, status: next_node.status }
  end

  def set_start_reject_state_machine
    { status: 'reject' }
  end

  def set_end_accept_state_machine
    { status: 'closed' }
  end


end