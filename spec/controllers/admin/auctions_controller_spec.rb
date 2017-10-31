require "rails_helper"

RSpec.describe Admin::AuctionsController, type: :controller do

  before {sign_in create(:user, :with_admin)}

  describe "auction management" do
    def do_request
      post :save, params: {auction: params}
    end

    context 'not auction' do
      it 'success' do
        get :obtain
        expect(response.body).to  eq('null')
        expect(response).to have_http_status(:ok)
      end
    end

    context 'got auctions list' do
      let(:params) {attributes_for(:auction)}

      before { do_request }

      it 'success' do
        get :obtain
        expect(response.body).to include('id')
        expect(response).to have_http_status(:ok)
      end
    end

    it "get an auction" do
      get :obtain

      expect(response.content_type).to eq("application/json")
      expect(response).to have_http_status(:ok)
    end
  end

  describe "auction management" do

    it "publish an auction" do
      post :publish, params: {id: 1, hello: {a: 'hello', b: 'world'}}

      expect(response.content_type).to eq("application/json")
      expect(response).to have_http_status(:ok)
    end
  end

  describe "auction management" do
    def do_request
      post :save, params: {auction: params}
    end

    context 'creates new auction' do
      # let(:params) {attributes_for(:auction)}
      let(:params) {create(:auction)}
      it 'success' do
        expect {do_request}.to change(Auction, :count).by(1)
      end
    end

    context 'update exsit auction' do
      let(:params) {create(:auction)}
      before { do_request }
      let(:params) { Hash(id: :auction.id, name: :auction.name + '-modified') }
      before { do_request }
      it 'success' do
        it { expect(Auction.last.name).to match '-modified' }
      end
    end
  end
end
