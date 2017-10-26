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

ActiveRecord::Schema.define(version: 20171026083033) do

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
    t.decimal "lt_peak", precision: 5, scale: 4, null: false
    t.decimal "lt_off_peak", precision: 5, scale: 4, null: false
    t.decimal "hts_peak", precision: 5, scale: 4, null: false
    t.decimal "hts_off_peak", precision: 5, scale: 4, null: false
    t.decimal "htl_peak", precision: 5, scale: 4, null: false
    t.decimal "htl_off_peak", precision: 5, scale: 4, null: false
    t.string "specifications_doc_url"
    t.string "briefing_pack_doc_url"
    t.bigint "user_id"
    t.bigint "auction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auction_id"], name: "index_arrangements_on_auction_id"
    t.index ["user_id"], name: "index_arrangements_on_user_id"
  end

  create_table "auctions", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "start_datetime", null: false
    t.date "contract_period_start_date", null: false
    t.date "contract_period_end_date", null: false
    t.integer "duration", null: false
    t.decimal "reserve_price", precision: 5, scale: 4, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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

end
