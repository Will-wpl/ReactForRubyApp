require "rails_helper"

RSpec.describe Admin::AuctionExtendTimesController, type: :controller do

  before { sign_in create(:user, :with_admin) }

  describe "#index" do
    def do_request
      get :index
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#new" do
    def do_request
      get :new
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#create" do
    def do_request
      post :create, params: { auction_extend_time: params }
    end

    context "success" do
      let(:params) { attributes_for(:auction_extend_time) }

      xit "creates new auction_extend_time" do
        expect { do_request }.to change(AuctionExtendTime, :count).by(1)

        params.each do |attr, value|
          expect(AuctionExtendTime.last.send(attr)).to eq value
        end
      end

      xit "redirects" do
        do_request
        expect(response).to redirect_to admin_auction_extend_time_path(AuctionExtendTime.last)
      end
    end

    context "failure" do
      let(:params) { Hash(name: nil) }

      xit "does not create auction_extend_time" do
        expect { do_request }.not_to change(AuctionExtendTime, :count)
      end

      xit "renders new" do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe "#show" do
    let(:auction_extend_time) { create(:auction_extend_time) }

    def do_request
      get :show, params: { id: auction_extend_time.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#edit" do
    let(:auction_extend_time) { create(:auction_extend_time) }

    def do_request
      get :edit, params: { id: auction_extend_time.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#update" do
    let(:auction_extend_time) { create(:auction_extend_time) }

    def do_request
      patch :update, params: { id: auction_extend_time.id, auction_extend_time: params }
    end

    before { do_request }

    context "success" do
      let(:params) { Hash(id: auction_extend_time.id, name: auction_extend_time.name + "-modified") }

      before { do_request }

      xit { expect(AuctionExtendTime.last.name).to match "-modified" }
      xit { expect(response).to redirect_to admin_auction_extend_time_path(AuctionExtendTime.last) }
    end

    context "failure" do
      let(:params) { Hash(name: "") }

      it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
    end
  end

  describe "#destroy" do
    let!(:auction_extend_time) { create(:auction_extend_time) }

    def do_request
      delete :destroy, params: { id: auction_extend_time.id }
      end

      xit "deletes a auction_extend_time" do
        expect { do_request }.to change(AuctionExtendTime, :count).by(-1)
    end

    xit "redirects" do
      do_request
      expect(response).to redirect_to admin_auction_extend_times_path
    end
  end
end
