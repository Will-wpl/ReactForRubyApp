require 'rails_helper'

RSpec.describe Api::Admin::AuctionHistoriesController, type: :controller do
  current_time = Time.current
  bid_time = Time.current + 10

  context 'OLD' do

    let!(:admin_user) { create(:user, :with_admin) }
    let!(:retailer_user) { create(:user, :with_retailer) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:retailer1) { create(:user, :with_retailer) }
    let!(:retailer2) { create(:user, :with_retailer) }
    let!(:retailer3) { create(:user, :with_retailer) }
    let!(:arrangement_1) { create(:arrangement, :accepted, user: retailer1, auction: auction) }
    let!(:arrangement_2) { create(:arrangement, :accepted, user: retailer2, auction: auction) }
    let!(:arrangement_3) { create(:arrangement, :accepted, user: retailer3, auction: auction) }
    let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time:current_time) }
    let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
    let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time:current_time) }
    let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time:bid_time) }
    let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
    let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time:current_time) }

    describe '#list' do
      def do_request
        get :list, params: { auction_id: auction.id }
      end
      context 'admin' do
        before { sign_in admin_user }
        before { do_request }
        it "got auction history list" do
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.size).to eq(3)
          expect(list_body[0].size).to eq(2)
          expect(list_body[0]['id']).to be_present
          expect(list_body[0]['data'][0]['name']).to be_present
          expect(list_body[0]['data'][0]['company_name']).to be_present
        end
      end

      context 'retailer' do
        before { sign_in retailer_user }
        before { do_request }

        it { expect(response).to have_http_status(401) }
      end
    end

    describe '#last' do
      def do_request
        get :last, params: { auction_id: auction.id }
      end
      context 'admin' do
        before { sign_in admin_user }
        before { do_request }
        it "got auction history last list" do
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.size).to eq(3)
        end
      end

      context 'retailer' do
        before { sign_in retailer_user }
        before { do_request }

        it { expect(response).to have_http_status(401) }
      end
    end

  end

  context 'NEW' do
    let!(:admin_user) { create(:user, :with_admin) }
    let!(:retailer_user) { create(:user, :with_retailer) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
    let!(:retailer1) { create(:user, :with_retailer) }
    let!(:retailer2) { create(:user, :with_retailer) }
    let!(:retailer3) { create(:user, :with_retailer) }
    let!(:six_month_contract) { create(:auction_contract, :six_month, :total, auction: auction ) }
    let!(:twelve_month_contract) { create(:auction_contract, :twelve_month, :total, auction: auction ) }
    let!(:arrangement_1) { create(:arrangement, :accepted, user: retailer1, auction: auction) }
    let!(:arrangement_2) { create(:arrangement, :accepted, user: retailer2, auction: auction) }
    let!(:arrangement_3) { create(:arrangement, :accepted, user: retailer3, auction: auction) }
    let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time:current_time, contract_duration: '6') }
    let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time:current_time, contract_duration: '6') }
    let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time:current_time, contract_duration: '6') }
    let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time:bid_time, contract_duration: '6') }
    let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time:current_time, contract_duration: '6') }
    let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time:current_time, contract_duration: '6') }
    let!(:auction_result) { create(:auction_result, user: retailer1, auction: auction) }
    let!(:auction_result_contract) { create(:auction_result_contract, auction_result: auction_result, user:retailer1, auction: auction , contract_duration: '6')}
    describe '#list' do
      def do_request
        get :list, params: { auction_id: auction.id }
      end
      context 'admin' do
        before { sign_in admin_user }
        before { do_request }
        it "got auction history list" do
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.key?('duration_6')).to eq(true)
          expect(list_body['duration_6']).to be_an(Array)
        end
      end
    end

    describe '#last' do
      def do_request
        get :last, params: { auction_id: auction.id }
      end
      context 'admin' do
        before { sign_in admin_user }
        before { do_request }
        it "got auction history last list" do
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.size).to eq(2)
          expect(list_body['duration_6'].size).to eq(4)
          # expect(list_body['duration_6'])
        end
      end
    end

    describe '# last when has contract_duration' do
      def do_request
        get :last, params: { auction_id: auction.id, contract_duration: '6' }
      end
      context 'admin' do
        before { sign_in admin_user }
        before { do_request }
        it "got auction history last list" do
          expect(response).to be_success
          list_body = JSON.parse(response.body)
          expect(list_body.size).to eq(4)
        end
      end
    end


  end

end
