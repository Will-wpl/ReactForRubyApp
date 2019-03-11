class User < ApplicationRecord

  # Field description:
  # approval_status for retailer
  # "0":"Reject by admin", "1":"Approved by admin", "2":"Pending"


  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze
  ApprovalStatusRegistering = '3'.freeze
  ApprovalStatusDisable = '4'.freeze
  ApprovalStatusRemoved = '5'.freeze

  ConsumerTypeCompany = '2'.freeze
  ConsumerTypeIndividual = '3'.freeze
  ConsumerTypeBuyerEntity = '4'.freeze
  ConsumerTypeTenant = '5'.freeze

  AgreeSellerBuyerYes='1'.freeze
  AgreeSellerBuyerNo='0'.freeze
  AgreeSellerRevvYes='1'.freeze
  AgreeSellerRevvNo='0'.freeze
  AgreeBuyerRevvYes='1'.freeze
  AgreeBuyerRevvNo='0'.freeze
  RequireTenants='1'.freeze
  NotRequireTenants='0'.freeze

  DefaultPassword='Password'.freeze

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  ROLES = %w[admin].freeze
  # Specify available roles in config/initializer/rolify.rb

  rolify

  # Extends

  # Includes

  # Associations
  # has_and_belongs_to_many :roles, join_table: :users_roles
  has_one :user_extension, dependent: :destroy
  has_many :company_buyer_entities, dependent: :destroy
  has_many :arrangements, dependent: :destroy
  has_many :auctions, through: :arrangements
  has_many :auction_events, dependent: :destroy
  has_many :auction_extend_times, dependent: :destroy
  has_many :auction_histories, dependent: :destroy
  has_many :consumptions, dependent: :destroy

  # accepts_nested_attributes

  # Validations
  validates_presence_of :name

  # Scopes
  scope :retailers, -> { includes(:roles).where(roles: { name: 'retailer' }).where('is_deleted is NULL OR is_deleted <> 1') }
  scope :retailers_deleted, -> { includes(:roles).where(roles: { name: 'retailer' }).where('is_deleted = 1') }
  scope :retailer_approved, -> { where(approval_status: ApprovalStatusApproved) } # "approval_status = '1'"
  scope :buyer_approved, -> { where(approval_status: ApprovalStatusApproved) }
  scope :buyers, -> { includes(:roles).where(roles: { name: 'buyer' }).where('is_deleted is NULL OR is_deleted <> 1') }
  scope :buyers_deleted, -> { includes(:roles).where(roles: { name: 'buyer' }).where('is_deleted = 1') }
  scope :buyer_entities, -> { includes(:roles).where(roles: { name: 'entity' }) }
  scope :tenants, -> { includes(:roles).where(roles: { name: 'tenant' }) }
  scope :selected_retailers, ->(auction_id) { includes(:arrangements).where(arrangements: { auction_id: auction_id }) }
  scope :selected_retailers_action_status, ->(auction_id, action_status) { includes(:arrangements).where(arrangements: { auction_id: auction_id, action_status: action_status }) }
  scope :selected_buyers, ->(auction_id) { includes(:consumptions).where(consumptions: { auction_id: auction_id }) }
  scope :selected_buyers_action_status, ->(auction_id, action_status) { includes(:consumptions).where(consumptions: { auction_id: auction_id, action_status: action_status }) }
  scope :exclude, ->(ids) { where('users.id not in (?)', ids) }
  scope :admins, -> { includes(:roles).where(roles: { name: 'admin' }) }
  scope :buyer_entities_by_email, ->(email) { includes(:roles).where('users.email = ? ', email) }

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  def self.find_buyer_entity_by_email(email)
    User.buyer_entities_by_email(email.downcase).first
  end

  def self.update_attachment_update_flag(users, file_flag_val)
    # users.update('tc_attachment_update_flag = tc_attachment_update_flag | ? ', tc_attachment_update_flag)
    users.each{ |u|
      if u.tc_attachment_update_flag.blank?
        u.tc_attachment_update_flag = file_flag_val
      else
        u.tc_attachment_update_flag |= file_flag_val
      end
      u.save
    }
  end
end
