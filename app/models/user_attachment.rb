class UserAttachment < ApplicationRecord

  # Extends

  # Includes

  # Associations

  # accepts_nested_attributes

  # Validations

  # Scopes
  # scope :belong_auction, ->(auction_id) { where('auction_id = ? and user_id is null', auction_id) }
  scope :find_by_user, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_by_id, ->(id) { where(id: id).take }
  scope :find_by_type, ->(file_type) {where('file_type = ?', file_type)}
  scope :find_by_type_user, ->(file_type, user_id) {where('file_type = ? and user_id = ?', file_type, user_id)}
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
  def self.find_last_by_type_user(user_id, file_type)
    UserAttachment.find_by_type_user(file_type, user_id).order(updated_at: :desc).last
  end

  def self.find_last_by_user(user_id)
    UserAttachment.find_by_user(user_id).order(updated_at: :desc).last
  end
end
