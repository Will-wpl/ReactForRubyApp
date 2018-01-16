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
                      submit_deviations: Event.new(:submit_deviations, :node3, 1, 2),
                      next: Event.new(:next, :node4, 2, 2),
                      send_response: Event.new(:send_response, :node3, 2, 1))
    @node4 = Node.new(:node4, 4, 'end',
                      submit: Event.new(:submit, :node4, 1, 2),
                      next: Event.new(:next, :node5, 2, 2),
                      accept: Event.new(:accept, :node5, 2, 1),
                      reject: Event.new(:reject, :node4, 2, 1))
    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 2, 2))
    super(node1: @node1, node2: @node2, node3: @node3, node4: @node4, node5: @node5)
  end

  def execute(node_name, event_name, arrangement_id)
    node = find_node_by_name(node_name)
    event = node.find_event_by_name(event_name)
    state_machine = set_state_machine_by_rule(node, event)
    TenderStateMachine.add_state_machine(arrangement_id, state_machine)
    yield if block_given?
    get_arrangement_state_machine(arrangement_id)
  end

  def get_current_action_status(arrangement_id)
    sm = TenderStateMachine.find_by_arrangement_id(arrangement_id).last
    if node1?(sm)
      { node1_retailer_accept: true, node1_retailer_reject: true }
    elsif node2?(sm)
      { node2_retailer_accept_all: true, node2_retailer_propose_deviations: true }
    elsif node3_retailer?(sm)
      { node3_retailer_withdraw_all_deviations: true, node3_retailer_submit: true }
    elsif node3_admin?(sm)
      { node3_send_response: true }
    elsif node4_retailer?(sm)
      { node4_retailer_submit: true, node4_retailer_next: true }
    elsif node4_admin?(sm)
      { node4_admin_accept: true, node4_admin_reject: true }
    elsif node5?(sm)
      { node5_retailer_submit: true }
    else
      {}
    end
  end



  protected

  def get_action_state_machine(auction_id)

  end

  def get_arrangement_state_machine(arrangement_id)
    flows = TenderStateMachine.find_by_arrangement_id(arrangement_id).where.not(current_node: nil).select(:current_node).distinct
    flow_array = []
    flows.each do |flow|
      flow_array.push(flow.current_node) unless flow.current_node.nil?
    end
    current = TenderStateMachine.find_by_arrangement_id(arrangement_id).last
    actions = get_current_action_status(arrangement_id)
    { flows: flow_array, current: current, actions: actions }
  end

  def node1?(sm)
    sm.current_node == 1 && sm.previous_node.nil? && sm.current_status.nil?
  end

  def node1_reject?(sm)
    sm.current_status == 'reject'
  end

  def node2?(sm)
    sm.current_node == 2
  end

  def node3_retailer?(sm)
    sm.current_node == 3 && sm.current_role = 2
  end

  def node3_admin?(sm)
    sm.current_node == 3 && sm.current_role = 1
  end

  def node4_retailer?(sm)
    sm.current_node == 4 && sm.current_role = 2
  end

  def node4_admin?(sm)
    sm.current_node == 4 && sm.current_role = 1
  end

  def node5?(sm)
    sm.current_node == 5
  end

  def finished?(sm)
    sm.current_node == 5 && sm.current_status == 'close'
  end

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
