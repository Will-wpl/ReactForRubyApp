require 'engine/workflow'
require 'engine/node'
require 'engine/event'
class TenderWorkflow < Workflow
  def initialize
    # from 1 is admin , 2 is retailer
    @node1 = Node.new(:node1, 1, 'begin',
                      accept: Event.new(:accept, :node2, 2),
                      reject: Event.new(:reject, nil, 2))
    @node2 = Node.new(:node2, 2, 'process',
                      accept_all: Event.new(:accept_all, :node4, 2),
                      propose_deviations: Event.new(:propose_deviations, :node3, 2))

    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 2))
    super(node1: @node1, node2: @node2)
  end

  def execute(node_name, event_name)
    node = find_node_by_name(node_name)
    event = node.find_event_by_name(event_name)
    state_machine = set_state_machine_by_rule(node, event)
    yield(state_machine) if block_given?
  end

  protected

  def set_state_machine_by_rule(node, event)
    if node.status == 'begin'
      if event.transitions_to.nil?
        set_start_reject_state_machine
      else
        set_processing_state_machine(node, event)
      end
    elsif node.status == 'end'
      if event.transitions_to.nil?
        set_end_accept_state_machine
      else
        set_processing_state_machine(node, event)
      end
    else
      set_processing_state_machine(node, event)
    end
  end

end
