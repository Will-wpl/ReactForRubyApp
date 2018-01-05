class User < ApplicationRecord
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
  scope :buyers, -> { includes(:roles).where(roles: { name: 'buyer' }) }
  scope :selected_retailers, ->(auction_id) { includes(:arrangements).where(arrangements: { auction_id: auction_id }) }
  scope :selected_buyers, ->(auction_id) { includes(:consumptions).where(consumptions: { auction_id: auction_id }) }
  scope :exclude, ->(ids) { where('users.id not in (?)', ids) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
