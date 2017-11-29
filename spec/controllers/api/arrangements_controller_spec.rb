require 'rails_helper'

RSpec.describe Api::ArrangementsController, type: :controller do

  let!(:retailer_user){ create(:user) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }

  describe '#index' do
    def do_request
      get :index
    end

    context 'without admin role' do
      before { sign_in retailer_user }

      before { do_request }

      it { expect(response).to have_http_status(401) }
    end

    context 'with admin role' do
      before { sign_in create(:user, :with_admin) }

      before { do_request }

      it { expect(response).to be_success }
    end
  end

  describe '#show' do

    def do_request
      get :show, params: {id: arrangement.id}
    end

    context 'authorize' do
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

    context 'authorize' do
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

    context 'authorize' do
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

end
