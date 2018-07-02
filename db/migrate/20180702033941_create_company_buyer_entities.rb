class CreateCompanyBuyerEntities < ActiveRecord::Migration[5.1]
  def change
    create_table :company_buyer_entities do |t|
      t.string :company_name
      t.string :company_uen
      t.string :company_address
      t.string :billing_address
      t.string :bill_attention_to
      t.string :contact_name
      t.string :contact_email
      t.string :contact_mobile_no
      t.string :contact_office_no
      t.timestamps
      t.belongs_to :user, index: true, foreign_key: true
    end
  end
end
