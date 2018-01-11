require 'rails_helper'

RSpec.describe Api::Buyer::AuctionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:auctions) { create_list(:auction, 10, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyers) { create_list(:user, 30, :with_buyer, :with_company_buyer) }
  let!(:consumption0) { create(:consumption, user: company_buyers[0], auction: auctions[0], participation_status: '1') }
  let!(:consumption1) { create(:consumption, user: company_buyers[0], auction: auctions[1], participation_status: '1') }
  let!(:consumption2) { create(:consumption, user: company_buyers[0], auction: auctions[2], participation_status: '1') }
  let!(:consumption3) { create(:consumption, user: company_buyers[0], auction: auctions[3], participation_status: '2') }
  let!(:consumption4) { create(:consumption, user: company_buyers[0], auction: auctions[7], participation_status: '2') }
  let!(:consumption5) { create(:consumption, user: company_buyers[0], auction: auctions[9], participation_status: '2') }
  let!(:consumption6) { create(:consumption, user: company_buyers[1], auction: auctions[7]) }
  let!(:consumption7) { create(:consumption, user: company_buyers[1], auction: auctions[9]) }
  let!(:consumption8) { create(:consumption, user: company_buyers[2], auction: auctions[7]) }
  let!(:consumption9) { create(:consumption, user: company_buyers[2], auction: auctions[9]) }

  base_url = 'api/buyer/auctions'
  # context 'retailer user' do
  #   before { sign_in retailer_user }
  #
  #   describe 'GET obtain' do
  #     context 'has an part of auction' do
  #       def do_request
  #         get :obtain, params: { id: auction.id }
  #       end
  #       before { do_request }
  #       it 'success' do
  #         hash_body = JSON.parse(response.body)
  #         expect(hash_body['id']).to eq(auction.id)
  #         expect(hash_body['name']).to be_nil
  #         expect(response).to have_http_status(:ok)
  #       end
  #     end
  #   end
  # end
  #
  describe 'GET buyer published auction list' do
    before { sign_in company_buyers[0] }
    context 'Pager published auction' do
      def do_request
        get :published, params: { page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(5)
        expect(hash['bodies']['total']).to eq(6)
        expect(hash['bodies']['data'].size).to eq(6)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'Params pagers published auction' do
      def do_request
        get :published, params: { name: [auctions[0].name, 'like', 'auctions'],
                                  actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between', 'auctions'],
                                  publish_status: [auctions[0].publish_status, '=', 'auctions'],
                                  participation_status: ['1', '='],
                                  page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(5)
        # expect(hash['bodies']['total']).to eq(3)
        expect(hash['bodies']['data'].size).to eq(3)
        expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        expect(hash['bodies']['data'][0]['actions']).to eq(1)
      end
    end
  end

  context 'api/retailer/auctions routes' do
    describe 'GET timer' do
      it 'success' do
        expect(get: "/#{base_url}/#{auction.id}/timer").not_to be_routable
      end
    end

    describe 'GET obtain' do
      it 'success' do
        expect(get: "/#{base_url}/obtain").to be_routable
        expect(get: "/#{base_url}/obtain").to route_to(controller: "#{base_url}",
                                                       action: "obtain")
      end
    end

    describe 'PUT publish' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/publish").not_to be_routable
      end
    end

    describe 'PUT hold' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/hold").not_to be_routable
      end
    end

    describe 'POST confirm' do
      it 'success' do
        expect(post: "/#{base_url}/#{auction.id}/confirm").not_to be_routable
      end
    end

    describe 'PUT/PATCH update' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}").not_to be_routable
        expect(patch: "/#{base_url}/#{auction.id}").not_to be_routable
      end
    end
  end
end
