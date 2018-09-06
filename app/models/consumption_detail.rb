class ConsumptionDetail < ApplicationRecord
  # Extends

  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze

  DraftFlagYesterday = 1.freeze
  DraftFlagBeforeYesterday = 2.freeze
  # Includes

  # Associations
  belongs_to :consumption
  has_one :company_buyer_entity
  has_one :user_attachment
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_consumption_id, ->(consumption_id) { where('consumption_id = ?', consumption_id) }
  scope :find_account_less_than_contract_start_date_last, ->(search_date, account_num) { joins(:company_buyer_entity, consumption: [:auction, :user]).where('contract_expiry < ? and account_number = ?', search_date, account_num).order(:contract_expiry).last }
  # Callbacks

  # Delegates

  # Custom


  # Methods (class methods before instance methods)

  # search list at create ra


  def self.find_account_less_than_contract_start_date(search_date, sort_by)
    default_sort = "cdf.entity_id ASC, cdf.contract_period_end_date DESC, cdf.entity_name ASC"
    sort_by = default_sort if sort_by.nil?
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*, a.id as auction_id, a.name as auction_name, a.published_gid as ra_id, e.user_id as buyer_id, e.company_name as entity_name, e.id as entity_id , ac.contract_period_end_date FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id
                                      JOIN consumptions c ON cd.consumption_id = c.id
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id
                                      AND ac.contract_period_end_date < ?
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 ORDER BY #{sort_by}
                              ", search_date]
  end

  def self.find_account_less_than_contract_start_date_last(search_date, user_id)
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*, a.id as auction_id, a.name as auction_name, a.published_gid as ra_id, e.user_id as buyer_id, e.company_name as entity_name, e.id as entity_id , ac.contract_period_end_date FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id
                                      JOIN consumptions c ON cd.consumption_id = c.id And c.user_id = :User_id
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id
                                      AND (ac.contract_period_end_date + interval '1 D') < :Search_date
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 ORDER BY cdf.entity_id ASC, cdf.contract_period_end_date DESC
                              ", { :Search_date => search_date, :User_id => user_id }]
  end

  def self.find_account_equal_to_contract_start_date_last(search_date, user_id)
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*, a.id as auction_id, a.name as auction_name, a.published_gid as ra_id, e.user_id as buyer_id, e.company_name as entity_name, e.id as entity_id , ac.contract_period_end_date FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id
                                      JOIN consumptions c ON cd.consumption_id = c.id And c.user_id = :User_id
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id
                                      AND (ac.contract_period_end_date + interval '1 D') = :Search_date
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 ORDER BY cdf.entity_id ASC, cdf.contract_period_end_date DESC
                              ", { :Search_date => search_date, :User_id => user_id}]
  end
end
