class User < ApplicationRecord

  # Field description:
  # approval_status for retailer
  # "0":"Reject by admin", "1":"Approved by admin", "2":"Pending"


  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze

  ConsumerTypeCompany = '2'.freeze
  ConsumerTypeIndividual = '3'.freeze

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
  has_one :user_extension
  has_many :arrangements
  has_many :auctions, through: :arrangements
  has_many :auction_events
  has_many :auction_extend_times
  has_many :auction_histories
  has_many :consumptions

  # accepts_nested_attributes

  # Validations
  validates_presence_of :name

  # Scopes
  scope :retailers, -> { includes(:roles).where(roles: { name: 'retailer' }) }
  scope :retailer_approved, -> { where(approval_status: ApprovalStatusApproved) } # "approval_status = '1'"
  scope :buyers, -> { includes(:roles).where(roles: { name: 'buyer' }) }
  scope :selected_retailers, ->(auction_id) { includes(:arrangements).where(arrangements: { auction_id: auction_id }) }
  scope :selected_retailers_action_status, ->(auction_id, action_status) { includes(:arrangements).where(arrangements: { auction_id: auction_id, action_status: action_status }) }
  scope :selected_buyers, ->(auction_id) { includes(:consumptions).where(consumptions: { auction_id: auction_id }) }
  scope :selected_buyers_action_status, ->(auction_id, action_status) { includes(:consumptions).where(consumptions: { auction_id: auction_id, action_status: action_status }) }
  scope :exclude, ->(ids) { where('users.id not in (?)', ids) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
