require 'rails_helper'

RSpec.describe RequestAuction, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:request_attachments) }
    it { is_expected.to have_one(:auction) }

  end
end
