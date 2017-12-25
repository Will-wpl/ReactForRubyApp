require 'rails_helper'

RSpec.describe Api::Admin::UsersController, type: :controller do

  let!(:retailers) { create_list(:user, 50, :with_retailer) }
  let!(:company_buyers) { create_list(:user, 30, :with_buyer, :with_company_buyer) }
  let!(:individual_buyers) { create_list(:user, 30, :with_buyer, :with_individual_buyer) }

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

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
          expect(hash['bodies']['total']).to eq(50)
          expect(hash['bodies']['data'].size).to eq(50)
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
          expect(hash['bodies']['total']).to eq(50)
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
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['data'].size).to eq(60)
          expect(hash['actions'].size).to eq(1)
        end
      end


      context 'Pager Search' do
        def do_request
          get :buyers, params: {page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(60)
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
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(30)
          expect(hash['bodies']['data'].size).to eq(10)
          expect(hash['actions'].size).to eq(1)
        end
      end

      context 'Conditions Pager Search' do
        def do_request
          get :buyers, params: { company_name: [company_buyers[0].company_name, 'like'], consumer_type: [company_buyers[0].consumer_type, '='], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(3)
          expect(hash['headers'][0]['field_name']).to eq('company_name')
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['company_name']).to eq(company_buyers[0].company_name)
          expect(hash['actions'].size).to eq(1)
        end
      end

    end
  end

end
