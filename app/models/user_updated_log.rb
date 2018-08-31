class UserUpdatedLog < ApplicationRecord

  # Scopes
  scope :find_by_user_id, ->(user_id) { where('users_id = ?', user_id).order(created_at: :desc) }
end
