require 'rails_helper'

RSpec.describe Api::Admin::UsersController, type: :controller do
  let! (:temp_retailer) { create(:user, :with_retailer)}
  let! (:temp_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:retailers) { create_list(:user, 50, :with_retailer) }
  let!(:company_buyers) { create_list(:user, 30, :with_buyer, :with_company_buyer) }
  let!(:individual_buyers) { create_list(:user, 30, :with_buyer, :with_individual_buyer) }
  let!(:temp_entity_user) { create(:user, :with_buyer_entity, consumer_type: '4', approval_status: '4' ) }

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'GET Deleted retailers' do

      context 'Base Search' do
        def do_request
          get :retailers_deleted
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(51)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Pager Search' do
        def do_request
          get :retailers_deleted, params: {page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(0)
          expect(hash['actions'].size).to eq(1)
        end
      end

    end

    describe 'GET retailers' do

      context 'Base Search' do
        def do_request
          get :retailers
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(51)
          expect(hash['bodies']['data'].size).to eq(51)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Pager Search' do
        def do_request
          get :retailers, params: {page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(51)
          expect(hash['bodies']['data'].size).to eq(10)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Conditions Pager Search' do
        def do_request
          get :retailers, params: { company_name: [retailers[0].company_name, 'like'], company_license_number: [retailers[0].company_license_number, 'like'], approval_status: [retailers[0].approval_status, '='], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Conditions Pager Search and sort' do
        def do_request
          get :retailers, params: { company_name: [retailers[0].company_name, 'like'], company_license_number: [retailers[0].company_license_number, 'like'], approval_status: [retailers[0].approval_status, '='], page_size: '10', page_index: '1', sort_by: ['company_name' , 'asc', ''] }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['actions'].size).to eq(1)
        end
      end

    end

    describe 'GET Deleted buyers' do

      context 'Base Search' do
        def do_request
          get :buyers_deleted
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['actions'].size).to eq(1)
        end
      end


      context 'Pager Search' do
        def do_request
          get :buyers_deleted, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['bodies']['total']).to eq(0)
          expect(hash['actions'].size).to eq(1)
        end
      end


      context 'Conditions Pager Search' do
        def do_request
          get :buyers_deleted, params: { consumer_type: [2, '='], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(0)
          expect(hash['actions'].size).to eq(1)
        end
      end
    end

    describe 'GET buyers' do

      context 'Base Search' do
        def do_request
          get :buyers
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['bodies']['data'].size).to eq(61)
          expect(hash['actions'].size).to eq(1)
        end
      end


      context 'Pager Search' do
        def do_request
          get :buyers, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['bodies']['total']).to eq(61)
          expect(hash['bodies']['data'].size).to eq(10)
          expect(hash['actions'].size).to eq(1)
        end
      end


      context 'Conditions Pager Search' do
        def do_request
          get :buyers, params: { consumer_type: [2, '='], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(31)
          expect(hash['bodies']['data'].size).to eq(10)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Conditions Pager Search' do
        def do_request
          get :buyers, params: { name: [company_buyers[0].company_name, 'like'], consumer_type: ['2', '='], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['headers'][0]['field_name']).to eq('company_name')
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['company_name']).to eq(company_buyers[0].company_name)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Conditions Pager Search and sort' do
        def do_request
          get :buyers, params: { name: [company_buyers[0].company_name, 'like'], consumer_type: ['2', '='], page_size: '10', page_index: '1', sort_by: ['company_name' , 'asc', 'users'] }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['headers'][0]['field_name']).to eq('company_name')
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['company_name']).to eq(company_buyers[0].company_name)
          expect(hash['actions'].size).to eq(1)
        end
      end


    end

    describe 'Post Approval User' do
      context 'Approval retailer' do
        def do_request
          put :approval_retailer, params: {user_id: temp_retailer.id, approved: '1', comment: 'user test - approval'}
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['user_base_info']['approval_status']).to eq('1')
        end
      end

      context 'Reject retailer' do
        def do_request
          put :approval_retailer, params: {user_id: temp_retailer.id, approved: nil, comment: 'user test - reject'}
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          # expect(hash['user_base_info']['approval_status']).to eq('0')
        end
      end

      context 'Approval buyer' do
        def do_request
          put :approval_buyer, params: {user_id: temp_buyer.id, approved: '1', comment: 'user test - approval'}
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['user_base_info']['approval_status']).to eq('1')
        end
      end

      context 'Reject buyer' do
        def do_request
          put :approval_buyer, params: {user_id: temp_buyer.id, approved: nil, comment: 'user test - reject'}
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Approval buyer entity' do
        def do_request
          buyer_entity_1 = CompanyBuyerEntity.new
          buyer_entity_1.company_name = 'Test_Company_Name_1'
          buyer_entity_1.company_uen = 'Test_Company_UEN_1'
          buyer_entity_1.company_address = 'Test_Company_Address_1'
          buyer_entity_1.contact_email = 'Buyer_entity_1@email.com'
          buyer_entity_1.user_id = temp_buyer.id
          buyer_entity_1.user_entity_id = temp_entity_user.id
          buyer_entity_1.approval_status = '2'
          buyer_entity_1.save!
          param = []
          param.push({entity_id: buyer_entity_1.id, approved_status: '1'})
          put :approval_buyer_entities, params: { entity_statuses: param.to_json }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['company_buyer_entities'][0]['approval_status']).to eq('1')
        end
      end

      context 'Pending buyer entity' do
        def do_request
          buyer_entity_1 = CompanyBuyerEntity.new
          buyer_entity_1.company_name = 'Test_Company_Name_1'
          buyer_entity_1.company_uen = 'Test_Company_UEN_1'
          buyer_entity_1.company_address = 'Test_Company_Address_1'
          buyer_entity_1.contact_email = 'Buyer_entity_1@email.com'
          buyer_entity_1.user_id = temp_buyer.id
          buyer_entity_1.user_entity_id = temp_entity_user.id
          buyer_entity_1.approval_status = '2'
          buyer_entity_1.save!
          param = []
          param.push({ entity_id: buyer_entity_1.id, approved_status: nil })
          put :approval_buyer_entities, params: { entity_statuses: param.to_json }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['company_buyer_entities'][0]['approval_status']).to eq('2')
        end
      end
    end


    describe 'Remove User' do
      context 'Remove retailer' do
        def do_request
          put :remove_retailer, params: { user_id: temp_retailer.id }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['result']).to eq('success')
        end
      end

      context 'Remove buyer' do
        def do_request
          put :remove_buyer, params: { user_id: temp_buyer.id }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['result']).to eq('success')
        end
      end
    end
  end

end
