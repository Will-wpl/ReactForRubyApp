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
          expect(hash['data'].size).to eq(50)
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
          expect(hash['data'].size).to eq(60)
          expect(hash['actions'].size).to eq(1)
        end
      end
    end
  end

end
