class CompanyBuyerEntitiesUpdatedLog < ApplicationRecord

  # Scopes
  scope :find_by_entity_id, ->(entity_id) { where('entity_id = ?', entity_id).order(created_at: :desc) }
end
