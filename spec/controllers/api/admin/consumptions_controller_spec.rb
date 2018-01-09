require 'rails_helper'

RSpec.describe Api::Admin::ConsumptionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:buyer_user){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:buyer_user_1){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:consumption) { create(:consumption, :init, user: buyer_user, auction: auction ) }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }

  describe '#index' do

    describe 'admin ' do
      before { sign_in admin_user }

      describe 'got consumption list buy auction_id' do
        def do_request
          get :index, params: { id: auction.id, consumer_type: '2' }
        end

        before { do_request }

        it "return list and total object" do
          expect(response).to be_success
          hash = JSON.parse(response.body)
          expect(hash['list'].size).to eq(1)
          expect(hash['list'][0]['lt_peak']).to eq('100.0')
          expect(hash['total_info']['lt_peak']).to eq('100.0')
        end
      end
    end
  end


  describe '#update_status' do

    describe 'admin ' do
      before { sign_in admin_user }

      describe 'new consumption action_status' do
        def do_request
          put :update_status, params: { id: 0, auction_id: auction.id, user_id: buyer_user_1.id }
        end

        before { do_request }

        it "return new consumption" do
          expect(response).to be_success
          expect(JSON.parse(response.body)['user_id']).to eq(buyer_user_1.id)
          expect(JSON.parse(response.body)['auction_id']).to eq(auction.id)
        end
      end

      describe 'update consumption action_status' do
        def do_request
          put :update_status, params: { id: consumption.id, action_status: '1' }
        end

        before { do_request }

        it "return updated consumption" do
          expect(response).to be_success
          expect(JSON.parse(response.body)['user_id']).to eq(buyer_user.id)
          expect(JSON.parse(response.body)['auction_id']).to eq(auction.id)
          expect(JSON.parse(response.body)['action_status']).to eq('1')
        end
      end

    end

    describe 'unauthorize' do

      before { sign_in create(:user) }

      def do_request
        put :update_status, params: { id: 0, auction_id: auction.id, user_id: buyer_user.id }
      end
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
