require 'rails_helper'

RSpec.describe Api::Retailer::ArrangementsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

  describe '#index' do
    def do_request
      get :index, params: { auction_id: auction.id, accept_status: '2' }
    end

    context 'without retailer role' do
      before { sign_in admin_user }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end

    context 'with retailer role' do
      before { sign_in retailer_user }

      before { do_request }

      it "will return himself" do
        list_body = JSON.parse(response.body)
        expect(list_body[0]['id']).to eq arrangement.id
        expect(list_body[0]['user_id']).to eq retailer_user.id
      end
    end
  end

  describe '#show' do

    def do_request
      get :show, params: {id: arrangement.id}
    end

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before{ do_request }

      it "can not asscess" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

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

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "can not asscess" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

      before { do_request }

      it "return user's arragement" do
        expect(response).to be_success
        expect(JSON.parse(response.body)['id']).to eq arrangement.id
        expect(JSON.parse(response.body)['user_id']).to eq retailer_user.id
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

    context 'authorize as an admin' do
      before { sign_in admin_user }

      before { do_request }

      it "can not access" do
        expect(response).to have_http_status(401)
      end
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

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

  describe '#new logic update' do
    let(:params) { Hash(main_name: 'test_user_name') }
    let!(:auction_new) { create(:auction, :for_next_month, :upcoming, :published) }
    let!(:arrangement_new) { create(:arrangement, user: retailer_user, auction: auction_new) }
    let!(:six_month_contract) { create(:auction_contract, :total, :six_month, auction: auction_new) }
    let!(:twelve_month_contract) { create(:auction_contract, :total, :twelve_month, auction: auction_new) }
    let!(:twenty_four_month_contract) { create(:auction_contract, :total, :twenty_four_month, auction: auction_new) }

    def do_request
      patch :update, params: { id: arrangement_new.id, arrangement: params }
    end

    context 'authorize as an retailer' do
      before { sign_in retailer_user }

      before { do_request }

      it "return updated user's arragement" do
        expect(response).to be_success
        expect(JSON.parse(response.body)['id']).to eq arrangement_new.id
        expect(JSON.parse(response.body)['main_name']).to eq 'test_user_name'
      end
    end

  end
end
