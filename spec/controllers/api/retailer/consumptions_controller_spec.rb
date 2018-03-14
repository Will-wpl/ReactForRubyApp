require 'rails_helper'

RSpec.describe Api::Retailer::ConsumptionsController, type: :controller do
  let!(:retailer_user) { create(:user, :with_retailer) }
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:buyer_user){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:buyer_user_1){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:consumption1) { create(:consumption, :init, user: buyer_user, auction: auction, participation_status: '1' ) }
  let!(:consumption2) { create(:consumption, :init, user: buyer_user_1, auction: auction, participation_status: '1' ) }

  describe '#acknowledge' do
    before { sign_in retailer_user }


    context 'Set acknowledge' do
      def do_request
        post :acknowledge, params: { id: consumption1.id }
      end
      before { do_request }

      it "success" do
        expect(response).to have_http_status(:ok)
        hash = JSON.parse(response.body)
        expect(hash['acknowledge']).to eq('1')
      end
    end

  end

  describe '#acknowledge_all' do
    before { sign_in retailer_user }


    context 'Set acknowledge' do
      def do_request
        ids = [consumption1.id, consumption2.id]
        post :acknowledge_all, params: { ids: ids }
      end
      before { do_request }

      it "success" do
        expect(response).to have_http_status(:ok)
        array = JSON.parse(response.body)
        expect(array[0]['acknowledge']).to eq('1')
      end
    end

  end

end
