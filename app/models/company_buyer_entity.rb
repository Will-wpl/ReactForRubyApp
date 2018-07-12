class CompanyBuyerEntity < ApplicationRecord
  # Extends

  # Includes

  # Associations
  belongs_to :user
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :find_by_user, ->(user_id) { where('user_id = ?', user_id) }
  
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
