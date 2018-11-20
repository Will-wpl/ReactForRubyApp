require 'rails_helper'

RSpec.describe Api::Admin::ConsumptionDetailsController, type: :controller do
  let!(:company_buyer_entity) { create(:company_buyer_entity, user: company_buyer, approval_status: '1') }
  let!(:admin_user){ create(:user, :with_admin, approval_status: '1') }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, is_saved: '1', participation_status: '1') }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id, draft_flag: 1) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id, draft_flag: 1) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id, draft_flag: 2) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id, draft_flag: 2) }

  describe 'GET buyer consumption detail list' do
    before { sign_in admin_user }

    context 'Has consumption detail list' do
      def do_request
        get :index, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash.size).to eq(10)
        expect(hash['consumption_details'].size).to eq(0)
        expect(response).to have_http_status(:ok)
      end
    end

  end
end
