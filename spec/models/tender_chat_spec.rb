require 'rails_helper'

RSpec.describe TenderChat, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:arrangement) }
    it { is_expected.to have_many(:tender_chat_details) }
  end
end
