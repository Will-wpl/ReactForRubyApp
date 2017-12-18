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

ActiveRecord::Schema.define(version: 20171218071207) do

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
    t.string "specifications_doc_url"
    t.string "briefing_pack_doc_url"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.string "accept_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auction_id"], name: "index_arrangements_on_auction_id"
    t.index ["user_id"], name: "index_arrangements_on_user_id"
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
    t.index ["auction_id"], name: "index_auction_histories_on_auction_id"
    t.index ["user_id"], name: "index_auction_histories_on_user_id"
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

  create_table "user_details", force: :cascade do |t|
    t.string "consumer_type"
    t.string "company_address"
    t.string "company_unique_entity_number"
    t.string "account_fin"
    t.string "account_mobile_number"
    t.string "account_office_number"
    t.string "account_home_number"
    t.string "account_housing_type"
    t.string "account_home_address"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_details_on_user_id"
  end

  create_table "user_extensions", force: :cascade do |t|
    t.string "login_status"
    t.string "current_room"
    t.string "current_page"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_extensions_on_user_id"
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
  add_foreign_key "auction_events", "auctions"
  add_foreign_key "auction_events", "users"
  add_foreign_key "auction_histories", "auctions"
  add_foreign_key "auction_histories", "users"
  add_foreign_key "auction_results", "auctions"
  add_foreign_key "user_details", "users"
  add_foreign_key "user_extensions", "users"
end
