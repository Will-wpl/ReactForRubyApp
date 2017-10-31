require "rails_helper"

RSpec.describe Admin::AuctionsController, type: :controller do

  before { sign_in create(:user, :with_admin) }

  describe "auction management" do
    it "get an auction" do
      get :getAuction
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

  # describe "#index" do
  #   def do_request
  #     get :index
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#new" do
  #   def do_request
  #     get :new
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#create" do
  #   def do_request
  #     post :create, params: { auction: params }
  #   end
  #
  #   context "success" do
  #     let(:params) { attributes_for(:auction) }
  #
  #     xit "creates new auction" do
  #       expect { do_request }.to change(Auction, :count).by(1)
  #
  #       params.each do |attr, value|
  #         expect(Auction.last.send(attr)).to eq value
  #       end
  #     end
  #
  #     xit "redirects" do
  #       do_request
  #       expect(response).to redirect_to admin_auction_path(Auction.last)
  #     end
  #   end
  #
  #   context "failure" do
  #     let(:params) { Hash(name: nil) }
  #
  #     xit "does not create auction" do
  #       expect { do_request }.not_to change(Auction, :count)
  #     end
  #
  #     xit "renders new" do
  #       do_request
  #       expect(response.status).to eq 200 # render current action (with the same form) and not redirect
  #     end
  #   end
  # end
  #
  # describe "#show" do
  #   let(:auction) { create(:auction) }
  #
  #   def do_request
  #     get :show, params: { id: auction.id }
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#edit" do
  #   let(:auction) { create(:auction) }
  #
  #   def do_request
  #     get :edit, params: { id: auction.id }
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#update" do
  #   let(:auction) { create(:auction) }
  #
  #   def do_request
  #     patch :update, params: { id: auction.id, auction: params }
  #   end
  #
  #   before { do_request }
  #
  #   context "success" do
  #     let(:params) { Hash(id: auction.id, name: auction.name + "-modified") }
  #
  #     before { do_request }
  #
  #     xit { expect(Auction.last.name).to match "-modified" }
  #     xit { expect(response).to redirect_to admin_auction_path(Auction.last) }
  #   end
  #
  #   context "failure" do
  #     let(:params) { Hash(name: "") }
  #
  #     it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
  #   end
  # end
  #
  # describe "#destroy" do
  #   let!(:auction) { create(:auction) }
  #
  #   def do_request
  #     delete :destroy, params: { id: auction.id }
  #     end
  #
  #     xit "deletes a auction" do
  #       expect { do_request }.to change(Auction, :count).by(-1)
  #   end
  #
  #   xit "redirects" do
  #     do_request
  #     expect(response).to redirect_to admin_auctions_path
  #   end
  # end
end
