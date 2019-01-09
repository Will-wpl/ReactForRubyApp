class AddContractTypeInRequestAuction < ActiveRecord::Migration[5.1]
  def change
    add_column :request_auctions, :contract_type, :string
  end
end
