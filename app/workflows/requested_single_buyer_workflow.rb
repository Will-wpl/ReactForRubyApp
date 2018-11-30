require 'engine/workflow'
require 'engine/node'
require 'engine/event'

class RequestedSingleBuyerWorkflow < SingleBuyerWorkflow

  def initialize
    # from 1 is admin , 2 is retailer, 3 is buyer
    # status 0 is begin(don't do any action), 1 is passed, 2 is pending
    @node3 = Node.new(:node3, 3, 'in processing',
                      back: Event.new(:back, :node2, 2, 2, '0'),
                      withdraw_all_deviations: Event.new(:withdraw_all_deviations, :node5, 2, 2, '0'),
                      submit_deviations: Event.new(:submit_deviations, :node3, 3, 2, '2'),
                      next: Event.new(:next, :node5, 2, 2, '0'),
                      send_response: Event.new(:send_response, :node3, 2, 3, '2'))
    super(node3: @node3)
  end

end
