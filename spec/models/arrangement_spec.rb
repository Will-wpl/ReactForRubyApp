require 'rails_helper'

RSpec.describe Arrangement, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:auction) }
    it { is_expected.to have_many(:tender_state_machines) }
    it { is_expected.to have_many(:tender_chats) }
  end
end
