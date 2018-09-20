class AddTemplateIdToAuctionResultContract < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_result_contracts, :parent_template_id, :int8
    add_column :auction_result_contracts, :entity_template_id, :int8
  end
end
