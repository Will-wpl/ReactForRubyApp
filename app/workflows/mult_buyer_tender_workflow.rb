require 'engine/workflow'
require 'engine/node'
require 'engine/event'

class MultBuyerTenderWorkflow < BaseTenderWorkflow
  def initialize
    # from 1 is admin , 2 is retailer
    # status 0 is begin(don't do any action), 1 is passed, 2 is pending
    @node1 = Node.new(:node1, 1, 'begin',
                      accept: Event.new(:accept, :node2, 2, 2, '0'),
                      reject: Event.new(:reject, nil, 2, 2, nil))
    @node2 = Node.new(:node2, 2, 'in processing',
                      accept_all: Event.new(:accept_all, :node5, 2, 2, '0'))
    @node5 = Node.new(:node5, 5, 'end',
                      submit: Event.new(:submit, nil, 1, 2, nil))
    super(node1: @node1, node2: @node2, node5: @node5)
  end

  def get_current_action_status(arrangement_id)
    sm = TenderStateMachine.where(arrangement_id: arrangement_id).last
    if node1?(sm)
      { node1_retailer_accept: true }
    elsif node2?(sm)
      { node2_retailer_accept_all: true }
    elsif node5?(sm)
      { node5_retailer_submit: true }
    else
      {}
    end
  end
end
