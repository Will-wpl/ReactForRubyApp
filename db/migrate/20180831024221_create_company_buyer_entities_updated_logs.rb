class CreateCompanyBuyerEntitiesUpdatedLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :company_buyer_entities_updated_logs do |t|
      t.string "company_name"
      t.string "company_uen"
      t.string "company_address"
      t.string "billing_address"
      t.string "bill_attention_to"
      t.string "contact_name"
      t.string "contact_email"
      t.string "contact_mobile_no"
      t.string "contact_office_no"
      t.bigint "user_id"
      t.integer "is_default"
      t.string "approval_status"
      t.bigint "user_entity_id"
      t.datetime "created_at", null: false
      t.timestamps
      t.bigint "entity_id"
    end
  end
end
