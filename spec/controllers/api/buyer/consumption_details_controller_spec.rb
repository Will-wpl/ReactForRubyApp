require 'rails_helper'

RSpec.describe Api::Buyer::ConsumptionDetailsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, participation_status: '1') }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }


  describe 'GET buyer consumption detail list' do
    before { sign_in company_buyer }

    context 'Has consumption detail list' do
      def do_request
        get :index, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        array = JSON.parse(response.body)
        expect(array.size).to eq(4)
        expect(array[0]['intake_level']).to eq('LT')
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'PUT update buyer consumption detail' do
    before { sign_in company_buyer }

    context 'Has updated a consumption detail' do
      def do_request
        consumption_lt.peak = '1000'
        consumption_lt.off_peak = '2000'
        detail = {
          account_number: consumption_lt.account_number,
          intake_level: consumption_lt.intake_level,
          peak: consumption_lt.peak,
          off_peak: consumption_lt.off_peak,
          consumption_id: consumption_lt.consumption_id
        }
        put :update, params: { id: consumption_lt.id, consumption_detail: detail }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['intake_level']).to eq('LT')
        expect(hash['peak']).to eq('1000.0')
        expect(hash['off_peak']).to eq('2000.0')
        expect(response).to have_http_status(:ok)
      end
    end

    context 'Has new a consumption detail' do
      def do_request
        detail = {
            account_number: consumption_lt.account_number,
            intake_level: consumption_lt.intake_level,
            peak: consumption_lt.peak,
            off_peak: consumption_lt.off_peak,
            consumption_id: consumption_lt.consumption_id
        }
        put :update, params: { id: 0, consumption_detail: detail }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['intake_level']).to eq('LT')
        expect(response).to have_http_status(:created)
      end
    end

  end

  describe 'PUT buyer consumption participate' do
    before { sign_in company_buyer }

    context 'Has set participation_status to 1 at consumption' do
      def do_request
        details = []
        details.push({account_number: '000001', intake_level: 'LT' , peak: '111', off_peak:'222'})
        details.push({account_number: '000002', intake_level: 'HTS' , peak: '111', off_peak:'222'})
        put :participate, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash['participation_status']).to eq('1')
      end
    end

  end

  describe 'DELETE buyer consumption reject' do
    before { sign_in company_buyer }

    context 'Has set participation_status to 0 at consumption' do
      def do_request
        delete :reject, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash['participation_status']).to eq('0')
      end
    end
  end
end
