class UserAttachment < ApplicationRecord

  # Field Descriptions
  FileType_Seller_Buyer_TC = 'SELLER_BUYER_TC'.freeze
  FileType_Seller_REVV_TC = 'SELLER_REVV_TC'.freeze
  FileType_Buyer_REVV_TC = 'BUYER_REVV_TC'.freeze
  FileType_Retailer_Doc = 'RETAILER_DOCUMENTS'.freeze
  FileType_Buyer_Doc = 'BUYER_DOCUMENTS'.freeze
  FileType_Letter_Authorisation = 'LETTER_OF_AUTHORISATION'.freeze

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
    UserAttachment.find_by_type_user(file_type, user_id).order(updated_at: :desc).first
  end

  def self.find_last_by_user(user_id)
    UserAttachment.find_by_user(user_id).order(updated_at: :desc).first
  end

  def self.find_last_by_type(file_type)
    UserAttachment.find_by_type(file_type).order(updated_at: :desc).first
  end
end
