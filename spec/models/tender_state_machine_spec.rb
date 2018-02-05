require 'rails_helper'

RSpec.describe TenderStateMachine, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:arrangement) }
  end
end
