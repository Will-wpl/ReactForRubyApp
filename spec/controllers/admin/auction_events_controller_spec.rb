require "rails_helper"

RSpec.describe Admin::AuctionEventsController, type: :controller do

  # before { sign_in create(:user, :with_admin) }
  #
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
  #     post :create, params: { auction_event: params }
  #   end
  #
  #   context "success" do
  #     let(:params) { attributes_for(:auction_event) }
  #
  #     xit "creates new auction_event" do
  #       expect { do_request }.to change(AuctionEvent, :count).by(1)
  #
  #       params.each do |attr, value|
  #         expect(AuctionEvent.last.send(attr)).to eq value
  #       end
  #     end
  #
  #     xit "redirects" do
  #       do_request
  #       expect(response).to redirect_to admin_auction_event_path(AuctionEvent.last)
  #     end
  #   end
  #
  #   context "failure" do
  #     let(:params) { Hash(name: nil) }
  #
  #     xit "does not create auction_event" do
  #       expect { do_request }.not_to change(AuctionEvent, :count)
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
  #   let(:auction_event) { create(:auction_event) }
  #
  #   def do_request
  #     get :show, params: { id: auction_event.id }
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#edit" do
  #   let(:auction_event) { create(:auction_event) }
  #
  #   def do_request
  #     get :edit, params: { id: auction_event.id }
  #   end
  #
  #   before { do_request }
  #
  #   xit { expect(response).to be_success }
  # end
  #
  # describe "#update" do
  #   let(:auction_event) { create(:auction_event) }
  #
  #   def do_request
  #     patch :update, params: { id: auction_event.id, auction_event: params }
  #   end
  #
  #   before { do_request }
  #
  #   context "success" do
  #     let(:params) { Hash(id: auction_event.id, name: auction_event.name + "-modified") }
  #
  #     before { do_request }
  #
  #     xit { expect(AuctionEvent.last.name).to match "-modified" }
  #     xit { expect(response).to redirect_to admin_auction_event_path(AuctionEvent.last) }
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
  #   let!(:auction_event) { create(:auction_event) }
  #
  #   def do_request
  #     delete :destroy, params: { id: auction_event.id }
  #     end
  #
  #     xit "deletes a auction_event" do
  #       expect { do_request }.to change(AuctionEvent, :count).by(-1)
  #   end
  #
  #   xit "redirects" do
  #     do_request
  #     expect(response).to redirect_to admin_auction_events_path
  #   end
  # end
end
