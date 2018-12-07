require 'engine/workflow'
require 'engine/node'
require 'engine/event'

class RequestedSingleBuyerWorkflow < BaseTenderWorkflow

  def initialize
    # from 1 is admin , 2 is retailer, 3 is buyer
    # status 0 is begin(don't do any action), 1 is passed, 2 is pending
    @node1 = Node.new(:node1, 1, 'begin',
                      accept: Event.new(:accept, :node2, 2, 2, '0'),
                      reject: Event.new(:reject, nil, 2, 2, nil))
    @node2 = Node.new(:node2, 2, 'in processing',
                      accept_all: Event.new(:accept_all, :node5, 2, 2, '0'),
                      propose_deviations: Event.new(:propose_deviations, :node3, 2, 2, '0'))
    @node3 = Node.new(:node3, 3, 'in processing',
                      back: Event.new(:back, :node2, 2, 2, '0'),
                      withdraw_all_deviations: Event.new(:withdraw_all_deviations, :node5, 2, 2, '0'),
                      submit_deviations: Event.new(:submit_deviations, :node3, 3, 2, '2'),
                      next: Event.new(:next, :node5, 2, 2, '0'),
                      send_response: Event.new(:send_response, :node3, 2, 3, '2'))
    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 1, 2, nil))
    super(node1: @node1, node2: @node2, node3: @node3, node5: @node5)
  end

  def get_current_action_status(arrangement_id)
    sm = TenderStateMachine.where(arrangement_id: arrangement_id).last
    if node1?(sm)
      { node1_retailer_accept: true }
    elsif node2?(sm)
      { node2_retailer_accept_all: true, node2_retailer_propose_deviations: true }
    elsif node3_retailer?(sm)
      if node3_retailer_next?(sm)
        { node3_retailer_next: true}
      else
        back = node3_retailer_has_submit?(sm) ? {node3_retailer_back: false} : {node3_retailer_back: true}
        if node3_retailer_has_chats?(sm)
          back.merge!({ node3_retailer_withdraw_all_deviations: true, node3_retailer_submit_deviations: true, node3_retailer_save: true })
        else
          back.merge!({ node3_retailer_submit_deviations: true, node3_retailer_save: true })
        end
      end
    elsif node3_admin?(sm)
      { node3_send_response: true }
    elsif node3_buyer?(sm)
      { node3_send_response: true }
    elsif node5?(sm)
      { node5_retailer_submit: true }
    else
      {}
    end
  end
  
end
