# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20181130072303) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "arrangements", force: :cascade do |t|
    t.string "main_name", null: false
    t.string "main_email_address", null: false
    t.string "main_mobile_number", null: false
    t.string "main_office_number", null: false
    t.string "alternative_name"
    t.string "alternative_email_address"
    t.string "alternative_mobile_number"
    t.string "alternative_office_number"
    t.decimal "lt_peak", precision: 5, scale: 4
    t.decimal "lt_off_peak", precision: 5, scale: 4
    t.decimal "hts_peak", precision: 5, scale: 4
    t.decimal "hts_off_peak", precision: 5, scale: 4
    t.decimal "htl_peak", precision: 5, scale: 4
    t.decimal "htl_off_peak", precision: 5, scale: 4
    t.bigint "user_id"
    t.bigint "auction_id"
    t.string "accept_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "action_status"
    t.decimal "eht_peak"
    t.decimal "eht_off_peak"
    t.string "comments"
    t.index ["auction_id"], name: "index_arrangements_on_auction_id"
    t.index ["user_id"], name: "index_arrangements_on_user_id"
  end

  create_table "auction_attachments", force: :cascade do |t|
    t.string "file_type"
    t.string "file_name"
    t.string "file_path"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["auction_id"], name: "index_auction_attachments_on_auction_id"
    t.index ["user_id"], name: "index_auction_attachments_on_user_id"
  end

  create_table "auction_contracts", force: :cascade do |t|
    t.string "contract_duration"
    t.date "contract_period_end_date"
    t.decimal "total_volume"
    t.decimal "total_lt_peak"
    t.decimal "total_lt_off_peak"
    t.decimal "total_hts_peak"
    t.decimal "total_hts_off_peak"
    t.decimal "total_htl_peak"
    t.decimal "total_htl_off_peak"
    t.decimal "total_eht_peak"
    t.decimal "total_eht_off_peak"
    t.decimal "starting_price_lt_peak"
    t.decimal "starting_price_lt_off_peak"
    t.decimal "starting_price_hts_peak"
    t.decimal "starting_price_hts_off_peak"
    t.decimal "starting_price_htl_peak"
    t.decimal "starting_price_htl_off_peak"
    t.decimal "starting_price_eht_peak"
    t.decimal "starting_price_eht_off_peak"
    t.decimal "reserve_price_lt_peak"
    t.decimal "reserve_price_lt_off_peak"
    t.decimal "reserve_price_hts_peak"
    t.decimal "reserve_price_hts_off_peak"
    t.decimal "reserve_price_htl_peak"
    t.decimal "reserve_price_htl_off_peak"
    t.decimal "reserve_price_eht_peak"
    t.decimal "reserve_price_eht_off_peak"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "auction_id"
    t.index ["auction_id"], name: "index_auction_contracts_on_auction_id"
  end

  create_table "auction_events", force: :cascade do |t|
    t.datetime "auction_when"
    t.text "auction_what"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.bigint "auction_id"
    t.string "auction_do"
    t.index ["auction_id"], name: "index_auction_events_on_auction_id"
    t.index ["user_id"], name: "index_auction_events_on_user_id"
  end

  create_table "auction_extend_times", force: :cascade do |t|
    t.integer "extend_time"
    t.datetime "current_time"
    t.datetime "actual_begin_time"
    t.datetime "actual_end_time"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auction_id"], name: "index_auction_extend_times_on_auction_id"
    t.index ["user_id"], name: "index_auction_extend_times_on_user_id"
  end

  create_table "auction_histories", force: :cascade do |t|
    t.decimal "average_price"
    t.decimal "lt_peak"
    t.decimal "lt_off_peak"
    t.decimal "hts_peak"
    t.decimal "hts_off_peak"
    t.decimal "htl_peak"
    t.decimal "htl_off_peak"
    t.datetime "bid_time"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "total_award_sum"
    t.integer "ranking"
    t.boolean "is_bidder"
    t.string "flag"
    t.datetime "actual_bid_time"
    t.decimal "eht_peak"
    t.decimal "eht_off_peak"
    t.string "contract_duration"
    t.index ["auction_id"], name: "index_auction_histories_on_auction_id"
    t.index ["user_id"], name: "index_auction_histories_on_user_id"
  end

  create_table "auction_result_contracts", force: :cascade do |t|
    t.decimal "reserve_price"
    t.decimal "lowest_average_price"
    t.string "status"
    t.string "lowest_price_bidder"
    t.date "contract_period_end_date"
    t.decimal "total_volume"
    t.decimal "total_award_sum"
    t.decimal "lt_peak"
    t.decimal "lt_off_peak"
    t.decimal "hts_peak"
    t.decimal "hts_off_peak"
    t.decimal "htl_peak"
    t.decimal "htl_off_peak"
    t.decimal "eht_peak"
    t.decimal "eht_off_peak"
    t.text "justification"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "auction_result_id"
    t.string "contract_duration"
    t.bigint "auction_id"
    t.bigint "user_id"
    t.decimal "reserve_price_lt_peak"
    t.decimal "reserve_price_lt_off_peak"
    t.decimal "reserve_price_hts_peak"
    t.decimal "reserve_price_hts_off_peak"
    t.decimal "reserve_price_htl_peak"
    t.decimal "reserve_price_htl_off_peak"
    t.decimal "reserve_price_eht_peak"
    t.decimal "reserve_price_eht_off_peak"
    t.bigint "parent_template_id"
    t.bigint "entity_template_id"
    t.index ["auction_id"], name: "index_auction_result_contracts_on_auction_id"
    t.index ["auction_result_id"], name: "index_auction_result_contracts_on_auction_result_id"
    t.index ["user_id"], name: "index_auction_result_contracts_on_user_id"
  end

  create_table "auction_results", force: :cascade do |t|
    t.decimal "reserve_price"
    t.decimal "lowest_average_price"
    t.string "status"
    t.string "lowest_price_bidder"
    t.date "contract_period_start_date"
    t.date "contract_period_end_date"
    t.decimal "total_volume"
    t.decimal "total_award_sum"
    t.decimal "lt_peak"
    t.decimal "lt_off_peak"
    t.decimal "hts_peak"
    t.decimal "hts_off_peak"
    t.decimal "htl_peak"
    t.decimal "htl_off_peak"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "eht_peak"
    t.decimal "eht_off_peak"
    t.string "justification"
    t.index ["auction_id"], name: "index_auction_results_on_auction_id"
    t.index ["user_id"], name: "index_auction_results_on_user_id"
  end

  create_table "auctions", force: :cascade do |t|
    t.string "name"
    t.datetime "start_datetime"
    t.date "contract_period_start_date"
    t.date "contract_period_end_date"
    t.integer "duration"
    t.decimal "reserve_price", precision: 5, scale: 4
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "actual_begin_time"
    t.datetime "actual_end_time"
    t.decimal "total_volume"
    t.string "publish_status"
    t.string "published_gid"
    t.decimal "total_lt_peak"
    t.decimal "total_lt_off_peak"
    t.decimal "total_hts_peak"
    t.decimal "total_hts_off_peak"
    t.decimal "total_htl_peak"
    t.decimal "total_htl_off_peak"
    t.boolean "hold_status", default: false
    t.string "time_extension"
    t.string "average_price"
    t.string "retailer_mode"
    t.decimal "total_eht_peak"
    t.decimal "total_eht_off_peak"
    t.decimal "starting_price"
    t.integer "starting_price_time"
    t.string "buyer_type"
    t.string "allow_deviation"
    t.datetime "published_date_time"
    t.text "tc_attach_info"
    t.bigint "request_auction_id"
    t.string "accept_status"
    t.bigint "request_owner_id"
    t.index ["request_auction_id"], name: "index_auctions_on_request_auction_id"
  end

  create_table "company_buyer_entities", force: :cascade do |t|
    t.string "company_name"
    t.string "company_uen"
    t.string "company_address"
    t.string "billing_address"
    t.string "bill_attention_to"
    t.string "contact_name"
    t.string "contact_email"
    t.string "contact_mobile_no"
    t.string "contact_office_no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.integer "is_default"
    t.string "approval_status"
    t.bigint "user_entity_id"
    t.index ["user_id"], name: "index_company_buyer_entities_on_user_id"
  end

  create_table "company_buyer_entities_updated_logs", force: :cascade do |t|
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
    t.datetime "updated_at", null: false
    t.bigint "entity_id"
  end

  create_table "consumption_details", force: :cascade do |t|
    t.string "account_number"
    t.string "intake_level"
    t.decimal "peak"
    t.decimal "off_peak"
    t.bigint "consumption_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "premise_address"
    t.decimal "contracted_capacity"
    t.string "existing_plan"
    t.string "blk_or_unit"
    t.string "street"
    t.string "unit_number"
    t.string "postal_code"
    t.decimal "totals"
    t.decimal "peak_pct"
    t.bigint "company_buyer_entity_id"
    t.bigint "user_attachment_id"
    t.string "approval_status"
    t.date "contract_expiry"
    t.integer "draft_flag"
    t.index ["company_buyer_entity_id"], name: "index_consumption_details_on_company_buyer_entity_id"
    t.index ["consumption_id"], name: "index_consumption_details_on_consumption_id"
    t.index ["user_attachment_id"], name: "index_consumption_details_on_user_attachment_id"
  end

  create_table "consumptions", force: :cascade do |t|
    t.string "action_status"
    t.string "participation_status"
    t.decimal "lt_peak"
    t.decimal "lt_off_peak"
    t.decimal "hts_peak"
    t.decimal "hts_off_peak"
    t.decimal "htl_peak"
    t.decimal "htl_off_peak"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "eht_peak"
    t.decimal "eht_off_peak"
    t.string "acknowledge"
    t.string "contract_duration"
    t.string "accept_status"
    t.string "comments"
    t.datetime "approval_date_time"
    t.integer "is_saved"
    t.index ["auction_id"], name: "index_consumptions_on_auction_id"
    t.index ["user_id"], name: "index_consumptions_on_user_id"
  end

  create_table "email_templates", force: :cascade do |t|
    t.string "subject"
    t.text "body"
    t.string "template_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
  end

  create_table "request_attachments", force: :cascade do |t|
    t.string "file_type"
    t.string "file_name"
    t.string "file_path"
    t.bigint "request_auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["request_auction_id"], name: "index_request_attachments_on_request_auction_id"
  end

  create_table "request_auctions", force: :cascade do |t|
    t.string "name"
    t.date "contract_period_start_date"
    t.integer "duration"
    t.string "buyer_type"
    t.string "allow_deviation"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "accept_status"
    t.index ["user_id"], name: "index_request_auctions_on_user_id"
  end

  create_table "rich_templates", force: :cascade do |t|
    t.integer "type"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "name"
  end

  create_table "roles", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.integer "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "tender_chat_details", force: :cascade do |t|
    t.string "retailer_response"
    t.string "sp_response"
    t.bigint "tender_chat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "response_status"
    t.string "propose_deviation"
    t.index ["tender_chat_id"], name: "index_tender_chat_details_on_tender_chat_id"
  end

  create_table "tender_chats", force: :cascade do |t|
    t.integer "item"
    t.string "clause"
    t.string "sp_response_status"
    t.bigint "arrangement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["arrangement_id"], name: "index_tender_chats_on_arrangement_id"
  end

  create_table "tender_state_machines", force: :cascade do |t|
    t.integer "previous_node"
    t.integer "current_node"
    t.string "current_status"
    t.integer "turn_to_role"
    t.integer "current_role"
    t.bigint "arrangement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["arrangement_id"], name: "index_tender_state_machines_on_arrangement_id"
  end

  create_table "user_attachments", force: :cascade do |t|
    t.string "file_type"
    t.string "file_name"
    t.string "file_path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.bigint "consumption_detail_id"
    t.index ["user_id"], name: "index_user_attachments_on_user_id"
  end

  create_table "user_extensions", force: :cascade do |t|
    t.string "login_status"
    t.string "current_room"
    t.string "current_page"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "logged_in_status"
    t.datetime "logged_in_last_time"
    t.string "ws_connected_status"
    t.datetime "ws_connected_last_time"
    t.string "ws_send_message_status"
    t.datetime "ws_send_message_last_time"
    t.string "current_ip"
    t.index ["user_id"], name: "index_user_extensions_on_user_id"
  end

  create_table "user_updated_logs", force: :cascade do |t|
    t.string "name"
    t.string "email", default: "", null: false
    t.string "company_name"
    t.string "approval_status"
    t.string "consumer_type"
    t.string "company_address"
    t.string "company_unique_entity_number"
    t.string "company_license_number"
    t.string "account_fin"
    t.string "account_mobile_number"
    t.string "account_office_number"
    t.string "account_home_number"
    t.string "account_housing_type"
    t.string "account_home_address"
    t.text "comment"
    t.string "billing_address"
    t.string "gst_no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "users_id"
    t.index ["users_id"], name: "index_user_updated_logs_on_users_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "company_name"
    t.string "approval_status"
    t.string "consumer_type"
    t.string "company_address"
    t.string "company_unique_entity_number"
    t.string "company_license_number"
    t.string "account_fin"
    t.string "account_mobile_number"
    t.string "account_office_number"
    t.string "account_home_number"
    t.string "account_housing_type"
    t.string "account_home_address"
    t.text "comment"
    t.string "billing_address"
    t.string "gst_no"
    t.string "agree_seller_buyer"
    t.string "agree_buyer_revv"
    t.string "agree_seller_revv"
    t.string "has_tenants"
    t.string "changed_contract"
    t.bigint "entity_id"
    t.bigint "tenant_id"
    t.datetime "approval_date_time"
    t.integer "is_deleted"
    t.datetime "deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "arrangements", "auctions"
  add_foreign_key "arrangements", "users"
  add_foreign_key "auction_attachments", "auctions"
  add_foreign_key "auction_contracts", "auctions"
  add_foreign_key "auction_events", "auctions"
  add_foreign_key "auction_events", "users"
  add_foreign_key "auction_histories", "auctions"
  add_foreign_key "auction_histories", "users"
  add_foreign_key "auction_result_contracts", "auctions"
  add_foreign_key "auction_results", "auctions"
  add_foreign_key "company_buyer_entities", "users"
  add_foreign_key "consumption_details", "company_buyer_entities"
  add_foreign_key "consumption_details", "consumptions"
  add_foreign_key "consumption_details", "user_attachments"
  add_foreign_key "consumptions", "auctions"
  add_foreign_key "consumptions", "users"
  add_foreign_key "request_attachments", "request_auctions"
  add_foreign_key "request_auctions", "users"
  add_foreign_key "user_extensions", "users"
end
