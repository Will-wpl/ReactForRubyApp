class ConsumptionDetail < ApplicationRecord
  # Extends

  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze
  # Includes

  # Associations
  belongs_to :consumption
  belongs_to :company_buyer_entity
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
end
