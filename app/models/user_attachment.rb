class UserAttachment < ApplicationRecord

  # Field Descriptions
  FileType_Seller_Buyer_TC = 'SELLER_BUYER_TC'.freeze
  FileType_Seller_REVV_TC = 'SELLER_REVV_TC'.freeze
  FileType_Buyer_REVV_TC = 'BUYER_REVV_TC'.freeze
  FileType_Retailer_Doc = 'RETAILER_DOCUMENTS'.freeze
  FileType_Buyer_Doc = 'BUYER_DOCUMENTS'.freeze
  FileType_Consumption_Detail_Doc = 'CONSUMPTION_DOCUMENTS'.freeze
  FileType_Letter_Authorisation = 'LETTER_OF_AUTHORISATION'.freeze
  FileType_Common = 'COMMON'.freeze

  FileFlag_Seller_Buyer_TC = 1.freeze
  FileFlag_Seller_REVV_TC = 2.freeze
  FileFlag_Buyer_REVV_TC = 4.freeze

  # Extends

  # Includes

  # Associations

  # accepts_nested_attributes

  # Validations

  # Scopes
  # scope :belong_auction, ->(auction_id) { where('auction_id = ? and user_id is null', auction_id) }
  scope :find_by_user, ->(user_id) { where('user_id = ?', user_id) }
  scope :find_by_ids, ->(ids) { where(' id in (?)',ids) }
  scope :find_by_type, ->(file_type) { where('file_type = ?', file_type) }
  scope :find_by_type_user, ->(file_type, user_id) { where('file_type = ? and user_id = ?', file_type, user_id) }
  scope :find_consumption_attachment, ->(consumption_detail_id) { where('consumption_detail_id = ? ', consumption_detail_id) }
  scope :find_consumption_attachment_by_user, ->(consumption_detail_id,user_id) {
    where('consumption_detail_id = ? and user_id = ? ', consumption_detail_id, user_id).order(updated_at: :desc)
  }
  scope :find_consumption_attachment_by_type, ->(consumption_detail_id,file_type) {
    where('consumption_detail_id = ? and file_type = ? ', consumption_detail_id, file_type).order(updated_at: :desc)
  }
  scope :find_consumption_attachment_by_user_type, ->(consumption_detail_id, user_id, file_type) {
    where('consumption_detail_id = ? and file_type = ? and user_id = ? ', consumption_detail_id, file_type, user_id).order(updated_at: :desc)
  }
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

  def self.find_list_by_type(file_type)
    UserAttachment.find_by_type(file_type).order(updated_at: :desc)
  end
end
