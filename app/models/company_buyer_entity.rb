class CompanyBuyerEntity < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  # accepts_nested_attributes

  # Validations

  # Field description:
  # approval_status
  # "0":"Reject by admin", "1":"Approved by admin", "2":"Pending"

  ApprovalStatusReject = '0'.freeze
  ApprovalStatusApproved = '1'.freeze
  ApprovalStatusPending = '2'.freeze
  ApprovalStatusRemoved = '5'.freeze

  # Scopes
  scope :find_by_user, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_by_status_user, ->(status, user_id) { where('user_id = ? and approval_status = ?', user_id, status) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
