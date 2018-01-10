class TenderStateMachine < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :arrangement
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_arrangement_id, ->(arrangement_id) { where('arrangement_id = ?', arrangement_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
