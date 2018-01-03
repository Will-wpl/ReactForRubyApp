require 'rails_helper'

RSpec.describe Api::Buyer::AuctionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auctions) { create_list(:auction, 10, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyers) { create_list(:user, 30, :with_buyer, :with_company_buyer) }
  let!(:comsumption0) { create(:comsumption, user: company_buyers[0], auction: auctions[0]) }
  let!(:comsumption1) { create(:comsumption, user: company_buyers[0], auction: auctions[1]) }
  let!(:comsumption2) { create(:comsumption, user: company_buyers[0], auction: auctions[2]) }
  let!(:comsumption3) { create(:comsumption, user: company_buyers[0], auction: auctions[3]) }
  let!(:comsumption4) { create(:comsumption, user: company_buyers[0], auction: auctions[7]) }
  let!(:comsumption5) { create(:comsumption, user: company_buyers[0], auction: auctions[9]) }
  let!(:comsumption6) { create(:comsumption, user: company_buyers[1], auction: auctions[7]) }
  let!(:comsumption7) { create(:comsumption, user: company_buyers[1], auction: auctions[9]) }
  let!(:comsumption8) { create(:comsumption, user: company_buyers[2], auction: auctions[7]) }
  let!(:comsumption9) { create(:comsumption, user: company_buyers[2], auction: auctions[9]) }

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
        expect(hash['headers'].size).to eq(4)
        expect(hash['bodies']['total']).to eq(6)
        expect(hash['bodies']['data'].size).to eq(6)
        expect(response).to have_http_status(:ok)
      end
    end

    # context 'Params pagers published auction' do
    #   def do_request
    #     get :published, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between'], page_size: '10', page_index: '1' }
    #   end
    #
    #   before { do_request }
    #   it 'Success' do
    #     hash = JSON.parse(response.body)
    #     expect(hash['headers'].size).to eq(4)
    #     expect(hash['bodies']['total']).to eq(2)
    #     expect(hash['bodies']['data'].size).to eq(2)
    #     expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
    #   end
    # end
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
