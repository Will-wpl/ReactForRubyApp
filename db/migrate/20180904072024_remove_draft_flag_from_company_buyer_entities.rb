class RemoveDraftFlagFromCompanyBuyerEntities < ActiveRecord::Migration[5.1]
  def change
    remove_column :company_buyer_entities, :draft_flag, :integer
  end
end
