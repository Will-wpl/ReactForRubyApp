class ConsumptionDetail < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :consumption
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_consumption_id, ->(consumption_id) { where('consumption_id = ?', consumption_id) }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
