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

end