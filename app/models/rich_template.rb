class RichTemplate < ApplicationRecord
  self.inheritance_column = nil

  LETTER_OF_AWARD_TEMPLATE = 1.freeze
  NOMINATED_ENTITY_TEMPLATE = 2.freeze
  ADVISORY_TEMPLATE = 3.freeze

  scope :find_by_type_last, ->(type) { where('type = ?', type).order(id: :desc).limit(1) }
end
