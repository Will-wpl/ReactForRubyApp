require 'rails_helper'

RSpec.describe Api::Retailer::AuctionsController, type: :controller do

  let!(:admin_user){ create(:user, :with_admin) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, action_status: '1') }


  base_url = 'api/retailer/auctions'
  context 'retailer user' do
    before { sign_in retailer_user }

    describe 'GET obtain' do
      context 'has an part of auction' do
        def do_request
          get :obtain, params: { id: auction.id }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction.id)
          expect(hash_body['name']).to eq(auction.name)
          expect(response).to have_http_status(:ok)
        end
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

  describe 'GET retailer published auction list' do
    before {sign_in retailer_user}
    context 'Page published auction' do
      def do_request
        get :published, params: {page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(6)
        expect(hash['bodies']['total']).to eq(1)
        expect(hash['bodies']['data'].size).to eq(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'Params pager published auction' do
      def do_request
        get :published, params: { name: [auction.name, 'like', 'auctions'],
                                  actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between', 'auctions'],
                                  publish_status: [auction.publish_status, '=', 'auctions'],
                                  page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(6)
        expect(hash['bodies']['data'].size).to eq(1)
        expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        expect(hash['bodies']['data'][0]['actions']).to eq(1)
        expect(hash['bodies']['data'][0]['auction_status']).to eq('In Progress')
      end
    end


  end

  describe 'GET letter of award pdf' do
    before { sign_in create(:user, :with_retailer) }

    context 'GET /api/retailer/auctions/letter_of_award_pdf' do
      it 'retailer letter of award pdf', pdf: true do
        user = create(:user, :with_retailer)
        expect(get: "/api/retailer/auctions/letter_of_award_pdf?auction_id=#{auction.id}&user_id=#{user.id}").to be_routable

        get :letter_of_award_pdf, params: {auction_id: auction.id, user_id: user.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end
    end
  end
end
