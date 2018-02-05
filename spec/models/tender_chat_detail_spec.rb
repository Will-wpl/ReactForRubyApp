require 'rails_helper'

RSpec.describe TenderChatDetail, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:tender_chat) }
  end
end
