class AddIsDefaultCompanyBuyerEntities < ActiveRecord::Migration[5.1]
  def change
    add_column :company_buyer_entities, :is_default, :integer
  end
end
