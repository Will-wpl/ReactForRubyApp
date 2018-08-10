class AddEntityUserIdToCompanyBuyerEntities < ActiveRecord::Migration[5.1]
  def change
    add_column :company_buyer_entities, :user_entity_id, :bigint
  end
end
