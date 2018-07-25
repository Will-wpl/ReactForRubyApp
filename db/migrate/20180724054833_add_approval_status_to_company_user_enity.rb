class AddApprovalStatusToCompanyUserEnity < ActiveRecord::Migration[5.1]
  def change
    add_column :company_buyer_entities, :approval_status, :string
  end
end
