class UserAttachment < ApplicationRecord

  # Extends

  # Includes

  # Associations

  # accepts_nested_attributes

  # Validations

  # Scopes
  # scope :belong_auction, ->(auction_id) { where('auction_id = ? and user_id is null', auction_id) }
  scope :find_by_user, ->(user_id) { where('user_id = ?', user_id) }
  scope :admin_find_by_id, ->(id) { where(id: id).take }
  scope :find_by_type, ->(file_type) {where('file_type = ?', file_type)}
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
