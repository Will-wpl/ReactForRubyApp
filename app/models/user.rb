class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # ROLES = %i[admin].freeze
  ROLES = Role.all
  rolify

  # Extends

  # Includes

  # Associations

  # accepts_nested_attributes

  # Validations
  validates_presence_of :name

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  # Getter/Setter to get/set role for a user on admin/users#new/#edit pages
  # Assumes that each user only has one role
  def role
    roles.first.name.to_sym if roles.present?
  end

  def role=(new_role)
    roles_name.each { |role_name| remove_role(role_name) }
    add_role(new_role)
  end
end
