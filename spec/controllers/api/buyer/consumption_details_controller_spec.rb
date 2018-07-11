require 'rails_helper'

RSpec.describe Api::Buyer::ConsumptionDetailsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01') }
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
        hash = JSON.parse(response.body)
        expect(hash.size).to eq(4)
        expect(hash['consumption_details'].size).to eq(4)
        expect(hash['consumption_details'][0]['intake_level']).to eq('EHT')
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'PUT buyer consumption save' do
    before { sign_in company_buyer }

    context 'Has set participation_status to 1 at consumption' do
      def do_request
        details = []
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100})
        details.push({id: 0, account_number: '000002', intake_level: 'HTS' , peak: 100, off_peak: 100})
        put :save, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        array = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(array.length).to eq(2)
      end
    end
  end

  describe 'PUT buyer consumption participate' do
    before { sign_in company_buyer }

    context 'Has set participation_status to 1 at consumption' do
      def do_request
        put :participate, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash['participation_status']).to eq('1')
        expect(hash['lt_peak']).to eq('100.0')
        expect(hash['lt_off_peak']).to eq('100.0')
        expect(hash['hts_peak']).to eq('100.0')
        expect(hash['hts_off_peak']).to eq('100.0')
        expect(hash['htl_peak']).to eq('100.0')
        expect(hash['htl_off_peak']).to eq('100.0')
        auction = Auction.find(hash['auction_id'])
        expect(auction.total_lt_peak.to_s).to eq('2468475.0')
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

  describe 'Validate consumption detail' do
    before { sign_in company_buyer }

    context 'Account number do not unique' do
      def do_request
        details = []
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'})
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4002'})
        details.push({id: 0, account_number: '000002', intake_level: 'HTS' , peak: 100, off_peak: 100, unit_number: 'UN 3', postal_code: '4003'})
        put :validate, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        hash_body = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash_body).to have_content('validate_result')
        expect(hash_body).to have_content('error_detail_indexes')
        expect(hash_body).to have_content('error_messages')
        expect(hash_body['validate_result']).to eq(false)
        expect(hash_body['error_detail_indexes']).to eq([0, 1])
      end
    end

    context 'unit number and postal code do not unique' do
      def do_request
        details = []
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'})
        details.push({id: 0, account_number: '000002', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4002'})
        details.push({id: 0, account_number: '000003', intake_level: 'HTS' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4002'})
        put :validate, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        hash_body = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash_body).to have_content('validate_result')
        expect(hash_body).to have_content('error_detail_indexes')
        expect(hash_body).to have_content('error_messages')
        expect(hash_body['validate_result']).to eq(false)
        expect(hash_body['error_detail_indexes']).to eq([1, 2])
      end
    end


    context 'contract expiry data > RA contract start date' do
      def do_request
        details = []
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001', contract_expiry: '2018-08-01'})
        details.push({id: 0, account_number: '000002', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4002', contract_expiry: '2018-06-01'})
        details.push({id: 0, account_number: '000003', intake_level: 'HTS' , peak: 100, off_peak: 100, unit_number: 'UN 3', postal_code: '4003', contract_expiry: '2018-08-01'})
        put :validate, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        hash_body = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash_body).to have_content('validate_result')
        expect(hash_body).to have_content('error_detail_indexes')
        expect(hash_body).to have_content('error_messages')
        expect(hash_body['validate_result']).to eq(false)
        expect(hash_body['error_detail_indexes']).to eq([1])
      end
    end
    context 'success' do
      def do_request
        details = []
        details.push({id: 0, account_number: '000001', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'})
        details.push({id: 0, account_number: '000002', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4002'})
        details.push({id: 0, account_number: '000003', intake_level: 'HTS' , peak: 100, off_peak: 100, unit_number: 'UN 3', postal_code: '4003'})
        put :validate, params: { consumption_id: consumption.id , details: details.to_json}
      end

      before { do_request }
      it 'Success' do
        hash_body = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(hash_body).to have_content('validate_result')
        expect(hash_body).to have_content('error_detail_indexes')
        expect(hash_body).to have_content('error_messages')
        expect(hash_body['validate_result']).to eq(true)
        expect(hash_body['error_detail_indexes']).to eq([])
      end
    end
  end

end
