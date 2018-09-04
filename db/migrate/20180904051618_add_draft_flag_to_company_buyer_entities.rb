class AddDraftFlagToCompanyBuyerEntities < ActiveRecord::Migration[5.1]
  def change
    add_column :company_buyer_entities, :draft_flag, :integer
  end
end
