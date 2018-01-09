require 'rails_helper'

RSpec.describe Arrangement, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
    it { is_expected.to have_one(:tender_state_machine) }
  end
end
