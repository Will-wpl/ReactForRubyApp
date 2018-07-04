class TenderHelper
  def self.current(arrangement_id)
    auction = get_auction(arrangement_id)
    workflow = if auction.auction_contracts.blank?
                 TenderWorkflow.new.get_arrangement_state_machine(arrangement_id)
               else
                 if auction.buyer_type == Auction::SingleBuyerType
                   if auction.allow_deviation == Auction::AllowDeviation
                     SingleBuyerWorkflow.new.get_arrangement_state_machine(arrangement_id)
                   else
                     MultBuyerTenderWorkflow.new.get_arrangement_state_machine(arrangement_id)
                   end
                 else
                   MultBuyerTenderWorkflow.new.get_arrangement_state_machine(arrangement_id)
                 end
               end
    workflow
  end

  def self.execute(node_name, event_name, arrangement_id)
    auction = get_auction(arrangement_id)
    workflow = if auction.auction_contracts.blank?
                 TenderWorkflow.new.execute(node_name, event_name, arrangement_id)
               else
                 if auction.buyer_type == Auction::SingleBuyerType
                   if auction.allow_deviation == Auction::AllowDeviation
                     SingleBuyerWorkflow.new.execute(node_name, event_name, arrangement_id)
                   else
                     MultBuyerTenderWorkflow.new.execute(node_name, event_name, arrangement_id)
                   end
                 else
                   MultBuyerTenderWorkflow.new.execute(node_name, event_name, arrangement_id)
                 end
               end
    workflow
  end

  def self.get_auction(arrangement_id)
    Arrangement.find(arrangement_id).auction
  end

end