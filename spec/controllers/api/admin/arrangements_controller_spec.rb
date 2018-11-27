require 'rails_helper'

RSpec.describe Api::Admin::ArrangementsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:retailer_1){ create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

  describe '#index' do
    def do_request
      get :index, params: { auction_id: auction.id, accept_status: '2' }
    end

    context 'without admin role' do
      before { sign_in retailer_user }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end

    context 'with admin role' do
      before { sign_in admin_user }

      context 'has not accept status' do
        def do_request
          get :index, params: { auction_id: auction.id }
        end
        before { do_request }
        it {
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.count).to eq 0
        }
      end

      context 'has accept status' do
        before { do_request }
        it {
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body[0]['id']).to eq arrangement.id
          expect(list_body[0]['user_id']).to eq retailer_user.id
        }
      end

    end
  end

  describe '#show' do

    def do_request
      get :show, params: {id: arrangement.id}
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

      before{ do_request }

      it "can not asscess" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before{ do_request }

      it "return user's arragement" do
        expect(response).to be_success
        expect(JSON.parse(response.body)['id']).to eq arrangement.id
        expect(JSON.parse(response.body)['user_id']).to eq retailer_user.id
      end
    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      before{ do_request }

      it { expect(response).to have_http_status(401) }
    end
  end

  describe '#obtain' do

    def do_request
      get :obtain, params: {user_id: retailer_user.id, auction_id: auction.id}
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

      before { do_request }

      it "can not asscess" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "return user's arragement" do
        expect(response).to be_success
        expect(response.body).to eq("null")
      end
    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end
  end

  describe '#update' do
    let(:params) { Hash(main_name: 'test_user_name') }

    def do_request
      patch :update, params: { id: arrangement.id, arrangement: params }
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

      before { do_request }

      it "return updated user's arragement" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "return updated user's arragement" do
        expect(response).to be_success
        expect(JSON.parse(response.body)['id']).to eq arrangement.id
        expect(JSON.parse(response.body)['main_name']).to eq 'test_user_name'
      end
    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end
  end

  describe '#update_status' do

    context 'admin ' do
      before { sign_in admin_user }

      describe 'new arrangement action_status' do
        def do_request
          put :update_status, params: { id: 0, auction_id: auction.id, user_id: retailer_1.id }
        end

        before { do_request }

        it "return new arrangement" do
          expect(response).to be_success
          hash = JSON.parse(response.body)
          has_tender = TenderStateMachine.where(arrangement_id: hash['id']).exists?
          expect(has_tender).to eq(true)
          expect(hash['user_id']).to eq(retailer_1.id)
          expect(hash['auction_id']).to eq(auction.id)
        end
      end

      describe 'update arrangement action_status' do
        def do_request
          put :update_status, params: { id: arrangement.id, action_status: '1' }
        end

        before { do_request }

        it "return updated arrangement" do
          expect(response).to be_success
          expect(JSON.parse(response.body)['user_id']).to eq(retailer_user.id)
          expect(JSON.parse(response.body)['auction_id']).to eq(auction.id)
          expect(JSON.parse(response.body)['action_status']).to eq('1')
        end
      end

    end

    context 'unauthorize' do
      before { sign_in create(:user) }

      def do_request
        put :update_status, params: { id: 0, auction_id: auction.id, user_id: retailer_user.id }
      end

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end
  end

  describe '#delete' do

    def do_request
      delete :destroy, params: { id: arrangement.id  }
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
