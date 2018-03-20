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

    context "# arrangement.accept_status != '1' and @auction.actual_begin_time < Time.current" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, :started ) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "# @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "# @auction.auction_result.nil? && Time.current > @auction.actual_end_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id) }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "# !@auction.auction_result.nil?" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_end_time: Date.current - 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      def do_request
        get :empty, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

  end

  describe '#goto' do

    context "@auction.publish_status != '1'" do
      let!(:auction) { create(:auction, :for_next_month) }

      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to empty_retailer_auction_path }
    end

    context "arrangement.accept_status != '1' and @auction.actual_begin_time < Time.current" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to empty_retailer_auction_path }
    end

    context "arrangement.accept_status != '1' and Time.current < @auction.actual_begin_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to upcoming_retailer_auction_path }
    end

    context "arrangement.accept_status == '1' and Time.current < @auction.actual_begin_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to upcoming_retailer_auction_path }
    end

    context "arrangement.accept_status == '1' and" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published,actual_begin_time: Date.current - 100, actual_end_time: Date.current + 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to empty_retailer_auction_path }
    end

    context "arrangement.accept_status == '1' and @auction.auction_result.nil? && Time.current > @auction.actual_end_time"  do
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to empty_retailer_auction_path }
    end

    context "arrangement.accept_status == '1' and !@auction.auction_result.nil?"  do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published,actual_begin_time: Date.current - 300, actual_end_time: Date.current - 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id) }
      def do_request
        get :goto, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to empty_retailer_auction_path }
    end

  end

  describe '#gotobid' do

    context "@auction.publish_status != '1'" do
      let!(:auction) { create(:auction, :for_next_month) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to message_retailer_auction_path }
    end

    context "arrangement.accept_status != '1' and @auction.actual_begin_time < Time.current" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to message_retailer_auction_path }
    end

    context "arrangement.accept_status != '1' and Time.current < @auction.actual_begin_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 100) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to message_retailer_auction_path }
    end

    context "arrangement.accept_status == '1' and Time.current < @auction.actual_begin_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 100) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to live_retailer_auction_path }
    end

    context "@auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time" do
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to live_retailer_auction_path }
    end

    context "@auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 100) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to live_retailer_auction_path }
    end

    context "@auction.auction_result.nil? && Time.current > @auction.actual_end_time && @auction.hold_status" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 300, actual_end_time: Date.current - 100, hold_status: true ) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to live_retailer_auction_path }
    end

    context "@auction.auction_result.nil? && Time.current > @auction.actual_end_time && !@auction.hold_status" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 300, actual_end_time: Date.current - 100 ) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to finish_retailer_auction_path }
    end

    context "!@auction.auction_result.nil?" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 300, actual_end_time: Date.current - 100 ) }
      let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id) }
      def do_request
        get :gotobid, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to redirect_to message_retailer_auction_path }
    end

  end

  describe '#message' do
    context "@auction.publish_status != '1'" do
      let!(:auction) { create(:auction, :for_next_month) }

      def do_request
        get :message, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "@auction.actual_begin_time < Time.current" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current - 300) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :message, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "Time.current < @auction.actual_begin_time" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 300) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '2') }
      def do_request
        get :message, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

    context "arrangement.accept_status == '1'" do
      let!(:auction) { create(:auction, :for_next_month,:upcoming, :published, actual_begin_time: Date.current + 300) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, accept_status: '1') }
      let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id) }
      def do_request
        get :message, params: { id: auction.id }
      end

      before { do_request }

      it { expect(response).to be_success }
    end

  end
end
