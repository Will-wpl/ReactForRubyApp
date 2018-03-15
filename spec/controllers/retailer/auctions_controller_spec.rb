require 'rails_helper'

RSpec.describe Retailer::AuctionsController, type: :controller do
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
  before { sign_in retailer_user }

  describe '#retailer_could_access' do
    def do_request
      get :upcoming, params: { id: auction.id }
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#empty' do

    context "# @auction.publish_status != '1'" do
      let!(:auction) { create(:auction, :for_next_month) }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "# else" do
      let!(:auction) { create(:auction, :for_next_month) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

  end

  describe '#goto' do
    def do_request
      get :goto, params: { id: auction.id }
    end

    before { do_request }

    it { expect(response).to redirect_to empty_retailer_auction_path }
  end

  describe '#gotobid' do
    def do_request
      get :gotobid, params: { id: auction.id }
    end

    before { do_request }

    it { expect(response).to redirect_to live_retailer_auction_path }
  end
end
