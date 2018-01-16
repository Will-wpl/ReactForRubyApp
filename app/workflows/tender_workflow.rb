require 'engine/workflow'
require 'engine/node'
require 'engine/event'
class TenderWorkflow < Workflow
  def initialize
    # from 1 is admin , 2 is retailer
    @node1 = Node.new(:node1, 1, 'begin',
                      accept: Event.new(:accept, :node2, 2, 2),
                      reject: Event.new(:reject, nil, 2, 2))
    @node2 = Node.new(:node2, 2, 'process',
                      accept_all: Event.new(:accept_all, :node4, 2, 2),
                      propose_deviations: Event.new(:propose_deviations, :node3, 2, 2))
    @node3 = Node.new(:node3, 3, 'process',
                      withdraw_all_deviations: Event.new(:withdraw_all_deviations, :node4, 2, 2),
                      submit: Event.new(:submit, :node3, 1, 2),
                      next: Event.new(:next, :node4, 2, 2),
                      send_response: Event.new(:send_response, :node3, 2, 1))
    @node4 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, :node4, 1, 2),
                      next: Event.new(:next, :node5, 2, 2),
                      accept: Event.new(:accept, :node5, 2, 1),
                      reject: Event.new(:reject, :node4, 2, 1))
    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 2, 2))
    super(node1: @node1, node2: @node2, node3: @node3, node4: @node4, node5: @node5)
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
