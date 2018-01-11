require 'rails_helper'

RSpec.describe Api::Buyer::AuctionAttachmentsController, type: :controller do
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }
  let! (:buyer_user) { create(:user, :with_buyer) }
  let!(:tc) { create(:auction_attachment, file_type: 'buyer_tc_upload0', file_name: 'test', file_path: 'test', auction: auction, user: buyer_user)}

  context 'Buyer user' do
    before { sign_in buyer_user }

    describe 'GET download_tc' do
      context 'Base get' do
        def do_request
          get :download_tc, params: { id: auction.id }
        end
        before { do_request }
        it 'success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['file_type']).to eq(tc.file_type)
        end
      end
    end
  end

end
