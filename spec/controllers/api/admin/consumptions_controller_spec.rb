require 'rails_helper'

RSpec.describe Api::Admin::ConsumptionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:buyer_user){ create(:user, :with_buyer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:consumption) { create(:consumption, user: buyer_user, auction: auction) }

  describe '#create' do

    def do_request
      post :create, params: { auction_id: auction.id, user_id: buyer_user.id }
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "return new arragement" do
        expect(response).to be_success
        expect(JSON.parse(response.body)['user_id']).to eq(buyer_user.id)
        expect(JSON.parse(response.body)['auction_id']).to eq(auction.id)
      end
    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end
  end

  describe '#delete' do

    def do_request
      delete :destroy, params: { id: consumption.id  }
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "deleted arragement" do
        expect(response).to be_success
        expect(response.body).to eq('null')
      end
    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end
  end
end
