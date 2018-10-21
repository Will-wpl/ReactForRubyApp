require 'rails_helper'

RSpec.describe Api::Buyer::ConsumptionDetailsController, type: :controller do

  context 'OLD' do
    let!(:admin_user){ create(:user, :with_admin) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01') }
    let!(:auction1) { create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01') }
    let!(:auction_contract) { create(:auction_contract,auction:auction, contract_duration: 6, contract_period_end_date: '2019-01-01') }
    let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
    let!(:company_buyer1) { create(:user, :with_buyer, :with_company_buyer) }
    let!(:company_buyer_entity) { create(:company_buyer_entity, user:company_buyer) }
    # let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer, approval_status: '1', company_unique_entity_number: 'Test UEN', company_name: 'test buyer', email: 'test_email4@email.com') }
    let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, participation_status: '1', contract_duration:6) }
    let!(:consumption1) { create(:consumption, user: company_buyer1, auction: auction, participation_status: '1', contract_duration:12) }
    let!(:consumption2) { create(:consumption, user: company_buyer1, auction: auction1, participation_status: '1', contract_duration:12) }
    let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id, company_buyer_entity_id: company_buyer_entity.id, account_number: '000001') }
    let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id, company_buyer_entity_id: company_buyer_entity.id, unit_number: 'UN 1', postal_code: '4001') }
    let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id, company_buyer_entity_id: company_buyer_entity.id) }
    let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id, company_buyer_entity_id: company_buyer_entity.id) }
    let!(:tc1) { create(:user_attachment, file_name: 'test', file_path: 'test')}
    let!(:tc2) { create(:user_attachment, file_name: 'test', file_path: 'test')}
    let!(:tc3) { create(:user_attachment, file_name: 'test', file_path: 'test')}

    describe 'GET buyer consumption detail list' do
      before { sign_in company_buyer }

      context 'Has consumption detail list' do
        def do_request
          get :index, params: { consumption_id: consumption.id}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash.size).to eq(10)
          expect(hash['consumption_details'].size).to eq(4)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'PUT buyer consumption save' do
      before { sign_in company_buyer }

      context 'Has set participation_status to 1 at consumption' do
        def do_request
          entity_1_attachment_ids = []
          entity_2_attachment_ids = []
          entity_1_attachment_ids.push(tc1.id)
          entity_1_attachment_ids.push(tc2.id)
          entity_2_attachment_ids.push(tc3.id)
          buyer_entity = CompanyBuyerEntity.new
          buyer_entity.company_name = 'Test_Company_Name_4'
          buyer_entity.company_uen = 'Test_Company_UEN_4'
          buyer_entity.company_address = 'Test_Company_Address_4'
          buyer_entity.contact_email = 'Buyer_entity_4@email.com'
          buyer_entity.user = company_buyer
          buyer_entity.save
          details = []
          details.push({id: 0, account_number: '00000A', intake_level: 'LT' , peak: 100, unit_number: 'UN A', postal_code: '4001A', company_buyer_entity_id:buyer_entity.id, contract_expiry: '2018-08-01',attachment_ids:entity_1_attachment_ids.to_json})
          details.push({id: 0, account_number: '00000B', intake_level: 'HTS' , peak: 100, unit_number: 'UN B', postal_code: '4001B', company_buyer_entity_id:buyer_entity.id, contract_expiry: '01-08-2018',attachment_ids:entity_2_attachment_ids.to_json})
          details_yesterday = []
          details_yesterday.push({id: 0, account_number: '000002', intake_level: 'HTS' , peak: 100, company_buyer_entity_id:buyer_entity.id, contract_expiry: '01-08-2018',attachment_ids:entity_2_attachment_ids.to_json})
          details_yesterday.push({id: 0, account_number: '000002', intake_level: 'HTS' , peak: 100, company_buyer_entity_id:buyer_entity.id, contract_expiry: '01-08-2018',attachment_ids:entity_2_attachment_ids.to_json})
          put :save, params: { consumption_id: consumption.id ,
                               details: details.to_json,
                               details_yesterday: [].to_json,
                               details_before_yesterday: [].to_json}
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
          entity_1_attachment_ids = []
          entity_2_attachment_ids = []
          entity_1_attachment_ids.push(tc1.id)
          entity_1_attachment_ids.push(tc2.id)
          entity_2_attachment_ids.push(tc3.id)
          buyer_entity = CompanyBuyerEntity.new
          buyer_entity.company_name = 'Test_Company_Name_4'
          buyer_entity.company_uen = 'Test_Company_UEN_4'
          buyer_entity.company_address = 'Test_Company_Address_4'
          buyer_entity.contact_email = 'Buyer_entity_4@email.com'
          buyer_entity.user = company_buyer
          buyer_entity.save
          details = []
          details.push({id: 0, account_number: '00000A', intake_level: 'LT' , peak: 100, unit_number: 'UN A', postal_code: '4001A', company_buyer_entity_id:buyer_entity.id, contract_expiry: '2018-08-01',attachment_ids:entity_1_attachment_ids.to_json})
          details.push({id: 0, account_number: '00000B', intake_level: 'HTS' , peak: 100, unit_number: 'UN B', postal_code: '4001B', company_buyer_entity_id:buyer_entity.id, contract_expiry: '01-08-2018',attachment_ids:entity_2_attachment_ids.to_json})
          put :participate, params: { consumption_id: consumption.id,
                                      details: details.to_json,
                                      details_yesterday: [].to_json,
                                      details_before_yesterday: [].to_json}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['consumption']['participation_status']).to eq('1')
          expect(hash['consumption']['lt_peak']).to eq('100.0')
          expect(hash['consumption']['lt_off_peak']).to eq('100.0')
          expect(hash['consumption']['hts_peak']).to eq('100.0')
          expect(hash['consumption']['hts_off_peak']).to eq('100.0')
          expect(hash['consumption']['htl_peak']).to eq('100.0')
          expect(hash['consumption']['htl_off_peak']).to eq('100.0')
          # auction = Auction.find(hash['auction_id'])
          # expect(auction.total_lt_peak.to_s).to eq('2468475.0')
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

      context '(Validate-Single)Account number do not unique' do
        def do_request
          detail = {id: 0, account_number: '000001',consumption_id: consumption.id, intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'}
          post :validate_single, params: { consumption_id: consumption1.id, detail: detail }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_details')
          expect(hash_body['validate_result']).to eq(false)
        end
      end

      context '(Validate-Single) Premise Address do not unique' do
        def do_request
          detail = {id: 0, account_number: '000002', intake_level: 'LT', consumption_id: consumption1.id , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'}
          put :validate_single, params: { consumption_id: consumption2.id, detail: detail }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_details')
          expect(hash_body['validate_result']).to eq(false)
        end
      end

      context '(Validate-Single) Success' do
        def do_request
          detail = {id: 0, account_number: '000002', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 2', postal_code: '4001'}
          put :validate_single, params: { consumption_id: consumption1.id, detail: detail }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_details')
          expect(hash_body['validate_result']).to eq(true)
        end
      end

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
        end
      end
      context 'success' do
        def do_request
          details = []
          details.push({id: 0, account_number: '000000', intake_level: 'LT' , peak: 100, off_peak: 100, unit_number: 'UN 1', postal_code: '4001'})
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

  context 'NEW' do
    let!(:admin_user){ create(:user, :with_admin) }
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01') }
    let!(:six_month_contract) { create(:auction_contract, :six_month, :total, auction: auction ) }
    let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
    let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, participation_status: '1', contract_duration: '6') }
    let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id) }
    let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id) }
    let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
    let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }

    describe 'PUT buyer consumption participate' do
      before { sign_in company_buyer }

      context 'Has set participation_status to 1 at consumption' do
        def do_request
          entity_1_attachment_ids = []
          entity_2_attachment_ids = []
          entity_1_attachment_ids.push(consumption_lt.id)
          entity_1_attachment_ids.push(consumption_hts.id)
          entity_2_attachment_ids.push(consumption_htl.id)
          buyer_entity = CompanyBuyerEntity.new
          buyer_entity.company_name = 'Test_Company_Name_4'
          buyer_entity.company_uen = 'Test_Company_UEN_4'
          buyer_entity.company_address = 'Test_Company_Address_4'
          buyer_entity.contact_email = 'Buyer_entity_4@email.com'
          buyer_entity.user = company_buyer
          buyer_entity.save
          details = []
          details.push({id: 0, account_number: '00000A', intake_level: 'LT' ,unit_number: 'UN A', postal_code: '400A', peak: 100, company_buyer_entity_id:buyer_entity.id, contract_expiry: '2018-08-01',attachment_ids:entity_1_attachment_ids.to_json})
          details.push({id: 0, account_number: '00000B', intake_level: 'HTS' ,unit_number: 'UN B', postal_code: '400B', peak: 100, company_buyer_entity_id:buyer_entity.id, contract_expiry: '01-08-2018',attachment_ids:entity_2_attachment_ids.to_json})
          put :participate, params: { consumption_id: consumption.id,
                                      details: details.to_json,
                                      details_yesterday: [].to_json,
                                      details_before_yesterday: [].to_json }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['consumption']['participation_status']).to eq('1')
          expect(hash['consumption']['lt_peak']).to eq('100.0')
          expect(hash['consumption']['lt_off_peak']).to eq('100.0')
          expect(hash['consumption']['hts_peak']).to eq('100.0')
          expect(hash['consumption']['hts_off_peak']).to eq('100.0')
          expect(hash['consumption']['htl_peak']).to eq('100.0')
          expect(hash['consumption']['htl_off_peak']).to eq('100.0')
          contract_duration = Auction.find(hash['consumption']['auction_id']).auction_contracts.where(contract_duration: '6').take
          expect(contract_duration.total_lt_peak.to_s).to eq('1000.0')
        end
      end

    end

  end


end
