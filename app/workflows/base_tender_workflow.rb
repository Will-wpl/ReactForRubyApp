require 'engine/workflow'
require 'engine/node'
require 'engine/event'

class BaseTenderWorkflow < Workflow

  def execute(node_name, event_name, arrangement_id)
    node = find_node_by_name(node_name)
    event = node.find_event_by_name(event_name)
    state_machine = set_state_machine_by_rule(node, event)
    TenderStateMachine.add_state_machine(arrangement_id, state_machine)
    yield if block_given?
    get_arrangement_state_machine(arrangement_id)
  end

  def get_arrangement_state_machine(arrangement_id)
    flows = TenderStateMachine.find_by_arrangement_id(arrangement_id).where.not(current_node: nil).select(:previous_node).distinct
    flow_array = []
    flows.each do |flow|
      flow_array.push(flow.previous_node) unless flow.previous_node.nil?
    end
    current = TenderStateMachine.find_by_arrangement_id(arrangement_id).last
    actions = get_current_action_status(arrangement_id)
    { flows: flow_array, current: current, actions: actions }
  end

  def get_action_state_machine(auction_id)
    arrangements = []
    Arrangement.find_by_auction_id(auction_id).joins(:user).order('users.company_name asc').each do |arrangement|
      arrangements.push(company_name: arrangement.user.company_name, arrangement_id: arrangement.id, detail: get_arrangement_state_machine(arrangement.id))
    end
    arrangements
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

  def node3_retailer_next?(sm)
    arrangement_id = sm.arrangement_id
    chats = TenderChat.where('arrangement_id = ?', arrangement_id)
    count = chats.count
    index = 0
    chats.each do |chat|
      if chat.sp_response_status == '1' || chat.sp_response_status == '4'
        index += 1
      end
    end
    if count != 0
      count == index
    else
      false
    end
  end

  def node3_retailer_has_chats?(sm)
    arrangement_id = sm.arrangement_id
    chats = TenderChat.where("arrangement_id = ? and sp_response_status != '2'", arrangement_id)
    count = chats.count
    count != 0
  end

  def node3_admin?(sm)
    sm.current_node == 3 && sm.current_role = 1
  end

  def node4_retailer?(sm)
    sm.current_node == 4 && sm.current_role = 2
  end

  def node4_retailer_show_submit?(sm)
    (sm.current_node == 4 && sm.current_status == '0' && sm.turn_to_role == 2 && sm.current_role == 2) ||
        (sm.previous_node == 4 && sm.current_node == 4 && sm.current_status == '4' && sm.turn_to_role == 2 && sm.current_role == 1)
  end

  def node4_retailer_show_next?(sm)
    (sm.previous_node == 4 && sm.current_node == 4 && sm.current_status == '3' && sm.turn_to_role == 2 && sm.current_role == 1)
  end

  def node4_admin?(sm)
    sm.current_node == 4 && sm.current_role == 1
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
        set_end_accept_state_machine(node, event)
      else
        set_processing_state_machine(node, event)
      end
    else
      set_processing_state_machine(node, event)
    end
  end
end