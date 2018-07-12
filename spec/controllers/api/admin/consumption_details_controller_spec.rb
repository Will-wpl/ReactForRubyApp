require 'rails_helper'

RSpec.describe Api::Admin::ConsumptionDetailsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, participation_status: '1') }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }


  describe 'GET buyer consumption detail list' do
    before { sign_in admin_user }

    context 'Has consumption detail list' do
      def do_request
        get :index, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash.size).to eq(5)
        expect(hash['consumption_details'].size).to eq(4)
        expect(hash['consumption_details'][0]['intake_level']).to eq('EHT')
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
