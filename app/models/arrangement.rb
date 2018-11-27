class Arrangement < ApplicationRecord

  # Important
  # Discarded fields: lt_peak lt_off_peak hts_peak hts_off_peak htl_peak htl_off_peak eht_peak eht_off_peak


  # Field description:
  # accept_status
  # "0":"Reject", "1":"Accept", "2":"Pending"
  # action_status: admin select retailers in auction creation
  # "1":"Notification sent", "2":"Pending Notification"

  AcceptStatusReject = '0'.freeze
  AcceptStatusAccept = '1'.freeze
  AcceptStatusPending = '2'.freeze

  ActionStatusSent = '1'.freeze
  ActionStatusPending = '2'.freeze
  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_many :tender_state_machines, dependent: :destroy
  has_many :tender_chats, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes

  scope :auction_of_current_user, ->(auction_id, user_id) { where('auction_id = ? and user_id = ?', auction_id, user_id) }
  scope :find_by_auction_and_user, ->(auction_id, user_id) { where('auction_id = ? and user_id =?', auction_id, user_id) }
  scope :is_not_notify, -> { where("action_status = '2'") }
  scope :find_published_auction, ->{ includes(:auction).where(auctions: { publish_status: '1' }) }
  scope :find_published_result_auction, ->{ includes(auction: :auction_result).where(auctions: { publish_status: '1' }, auction_results: { status: nil }) }
  scope :find_notify_retailer,  ->(user_id) { where("arrangements.user_id = ? and action_status = '1'", user_id) }
  scope :admin_find_by_id, ->(id) { where(id: id).take }
  scope :find_by_user, ->(user_id) { where('user_id =?', user_id) }
  scope :find_by_approvaled_user, -> { includes(:user).where(users: { approval_status: '1' }) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.query_list(auction_id, accept_status)
    query = Arrangement.select('arrangements.*, users.company_name , user_extensions.login_status , user_extensions.current_room , user_extensions.current_page, users.approval_status').left_outer_joins(user: :user_extension).order('arrangements.accept_status ASC, users.company_name ASC')
    if accept_status.nil?
      query.where("arrangements.auction_id = :auction_id and arrangements.accept_status = :accept_status", auction_id: auction_id, accept_status: '1')
    else
      query.where("arrangements.auction_id = :auction_id and arrangements.accept_status = :accept_status", auction_id: auction_id, accept_status: accept_status)
    end
  end

  def self.query_list_by_self(auction_id, accept_status, user_id)
    query = query_list(auction_id, accept_status)
    query.where('user_id': user_id)
  end
end
