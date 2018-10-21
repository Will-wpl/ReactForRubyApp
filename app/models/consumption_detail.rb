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
    default_sort = "cdf.contract_period_end_date DESC, cdf.entity_id ASC, cdf.entity_name ASC"
    sort_by = default_sort if sort_by.nil?
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*, a.id as auction_id, a.name as auction_name, a.published_gid as ra_id, e.user_id as buyer_id, e.company_name as entity_name, e.id as entity_id , ac.contract_period_end_date FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id
                                      JOIN users u ON e.user_id = u.id
                                      JOIN consumptions c ON cd.consumption_id = c.id
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id
                                      AND e.approval_status = '1'
                                      AND u.approval_status = '1'
                                      AND (u.is_deleted is NULL OR u.is_deleted <> 1)
                                      AND c.accept_status = '1'
                                      AND c.contract_duration = ac.contract_duration
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 AND cdf.contract_period_end_date < ? ORDER BY #{sort_by}
                              ", search_date]
  end

  def self.find_account_less_than_contract_start_date_last(search_date, user_id)
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*,
                                            a.id as auction_id,
                                            a.name as auction_name,
                                            a.published_gid as ra_id,
                                            e.user_id as buyer_id,
                                            e.company_name as entity_name,
                                            e.id as entity_id ,
                                            ac.contract_duration,
                                            a.contract_period_start_date,
                                            ac.contract_period_end_date
                                          FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id And e.approval_status = '1'
                                      JOIN users u ON e.user_id = u.id AND u.approval_status = '1' AND (u.is_deleted is NULL OR u.is_deleted <> 1)
                                      JOIN consumptions c ON cd.consumption_id = c.id And c.user_id = :User_id And c.accept_status = :Consumption_status
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id AND c.contract_duration = ac.contract_duration
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 AND (cdf.contract_period_end_date + interval '1 D') < :Search_date
                              ORDER BY cdf.entity_id ASC, cdf.contract_period_end_date DESC
                              ", { :Search_date => search_date, :User_id => user_id, :Consumption_status => Consumption::AcceptStatusApproved }]
  end

  def self.find_account_equal_to_contract_start_date_last(search_date, user_id)
    Consumption.find_by_sql ["SELECT cdf.*
                              FROM (SELECT cda.*, row_number()
                                    OVER (PARTITION BY cda.account_number ORDER BY cda.contract_period_end_date DESC ) as n
                                    FROM (SELECT cd.*,
                                            a.id as auction_id,
                                            a.name as auction_name,
                                            a.published_gid as ra_id,
                                            e.user_id as buyer_id,
                                            e.company_name as entity_name,
                                            e.id as entity_id ,
                                            ac.contract_duration,
                                            a.contract_period_start_date,
                                            ac.contract_period_end_date
                                          FROM consumption_details cd
                                      JOIN company_buyer_entities e ON cd.company_buyer_entity_id = e.id And e.approval_status = '1'
                                      JOIN users u ON e.user_id = u.id AND u.approval_status = '1' AND (u.is_deleted is NULL OR u.is_deleted <> 1)
                                      JOIN consumptions c ON cd.consumption_id = c.id And c.user_id = :User_id And c.accept_status = :Consumption_status
                                      JOIN auctions a ON c.auction_id = a.id
                                      JOIN auction_contracts ac ON a.id = ac.auction_id AND c.contract_duration = ac.contract_duration
                                          ) as cda
                                    ) as cdf
                              WHERE cdf.n <= 1 AND (cdf.contract_period_end_date + interval '1 D') = :Search_date
                              ORDER BY cdf.entity_id ASC, cdf.contract_period_end_date DESC
                              ", { :Search_date => search_date, :User_id => user_id, :Consumption_status => Consumption::AcceptStatusApproved }]
  end

  def self.validation_info(consumption_id, contract_duration, current_contract_period_start_date)
    ConsumptionDetail.find_by_sql ["select cd.id, c_1.id, cd.account_number, cd.postal_code, cd.unit_number,old_c.contract_duration, old_c.contract_pariod_start_date, old_c.contract_period_end_date
                                    from consumption_details cd
                                    inner join consumptions c_1 on cd.consumption_id = c_1.id
                                    inner join auctions a_1 on c_1.auction_id = a_1.id
                                    inner join (
                                        SELECT
                                          c.id                         AS consumption_id,
                                          a.contract_period_start_date AS contract_pariod_start_date,
                                          CASE WHEN c.contract_duration IS NULL
                                            THEN a.contract_period_end_date
                                          ELSE CASE WHEN ac.contract_duration IS NULL
                                            THEN a.contract_period_start_date + INTERVAL ':Contract_duration M'
                                               ELSE ac.contract_period_end_date
                                               END
                                          END                          AS contract_period_end_date,
                                          case when ac.contract_duration is null then c.contract_duration
                                            else ac.contract_duration end AS contract_duration,
                                          c.participation_status,
                                          c.accept_status
                                        FROM consumptions c
                                          INNER JOIN auctions a ON c.auction_id = a.id
                                          LEFT JOIN auction_contracts ac ON ac.auction_id = a.id
                                        WHERE (c.participation_status != '0' OR c.participation_status IS NULL)
                                              AND (c.accept_status != '0' OR c.accept_status IS NULL)
                                        and c.id <> :Current_consumption_id
                                        ) old_c on c_1.id = old_c.consumption_id
                                    where old_c.contract_pariod_start_date is not null
                                          and old_c.contract_period_end_date is not null
                                          and old_c.contract_period_end_date >= :Current_contract_period_start_date
                                    ", { :Current_consumption_id => consumption_id,
                                         :Contract_duration => contract_duration,
                                         :Current_contract_period_start_date => current_contract_period_start_date }]
  end
end
