require 'rails_helper'

RSpec.describe Admin::AuctionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }

  before { sign_in admin_user }

  describe '#result' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    def do_request
      get :result, params: { id: auction.id }
    end

    before { do_request }

    it { expect(response).to be_success }
  end

end
