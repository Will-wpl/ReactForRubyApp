class RequestAuction < ApplicationRecord

  # Extends

  # Includes

  # Associations
  belongs_to :user
  has_one :auction
  has_many :request_attachments

  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
