require 'engine/workflow'
require 'engine/node'
require 'engine/event'

class RequestedSingleBuyerWorkflow < SingleBuyerWorkflow

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
  
end
