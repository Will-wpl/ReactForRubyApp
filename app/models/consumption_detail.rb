class ConsumptionDetail < ApplicationRecord
  # Extends

  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze
  # Includes

  # Associations
  belongs_to :consumption
  has_one :company_buyer_entity
  has_one :user_attachment
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_consumption_id, ->(consumption_id) { where('consumption_id = ?', consumption_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
