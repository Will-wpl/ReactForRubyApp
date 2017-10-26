class CreateArrangements < ActiveRecord::Migration[5.1]
  def change
    create_table :arrangements do |t|
      t.string :main_name, null: false
      t.string :main_email_address, null: false
      t.string :main_mobile_number, null: false
      t.string :main_office_number, null: false
      t.string :alternative_name
      t.string :alternative_email_address
      t.string :alternative_mobile_number
      t.string :alternative_office_number
      t.decimal :lt_peak, null: false, precision: 5, scale: 4
      t.decimal :lt_off_peak, null: false, precision: 5, scale: 4
      t.decimal :hts_peak, null: false, precision: 5, scale: 4
      t.decimal :hts_off_peak, null: false, precision: 5, scale: 4
      t.decimal :htl_peak, null: false, precision: 5, scale: 4
      t.decimal :htl_off_peak, null: false, precision: 5, scale: 4
      t.string :specifications_doc_url
      t.string :briefing_pack_doc_url
      t.belongs_to :user, index: true
      t.belongs_to :auction, index: true
      t.string :accept_status
      t.timestamps
    end
  end
end
