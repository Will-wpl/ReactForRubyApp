class RequestAuction < ApplicationRecord

  # Extends
  AcceptStatusReject = '0'.freeze
  AcceptStatusApproved = '1'.freeze
  AcceptStatusPending = '2'.freeze

  SingleBuyerType = '0'.freeze
  MultipleBuyerType = '1'.freeze
  AllowDeviation = '1'.freeze
  NotAllowDeviation = '0'.freeze

  # Includes

  # Associations
  belongs_to :user
  has_one :auction
  has_many :request_attachments

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :mine, ->(user_id) { where(user_id: user_id).order(:updated_at) }
  scope :find_pending, -> { where(accept_status: RequestAuction::AcceptStatusPending).order(:updated_at) }

  # Search
  def self.find_buyer_entity_contract_info(buyer_id, sort_by)
    default_sort = "cdf.contract_expiry DESC"
    sort_by = default_sort if sort_by.nil?
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cd.*, a.id as auction_id, a.name as auction_name, a.published_gid as ra_id, e.user_id as buyer_id, e.company_name as entity_name, e.id as entity_id , ac.contract_period_end_date, retailer.name as retailer_name FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id
                                      JOIN users u ON e.user_id = u.id
                                      JOIN consumptions c ON cd.consumption_id = c.id
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_result_contracts ac ON a.id = ac.auction_id
                                      JOIN users retailer ON ac.user_id = retailer.id
                                      AND e.approval_status = '1'
                                      AND u.approval_status = '1'
                                      AND ac.status <> 'void'
                                      AND (u.is_deleted is NULL OR u.is_deleted <> 1)
                                      AND c.accept_status = '1'
                                      AND c.contract_duration = ac.contract_duration
                                      AND e.user_id = :Buyer_id
                                    ) as cdf
                              WHERE cdf.contract_period_end_date > current_date ORDER BY #{sort_by}
                             ", {:Buyer_id => buyer_id}]
  end

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
