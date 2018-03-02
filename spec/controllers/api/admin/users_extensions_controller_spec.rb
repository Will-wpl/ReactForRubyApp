require 'rails_helper'

RSpec.describe Api::Admin::UserExtensionsController, type: :controller do

  # let!(:retailers) { create_list(:user, 20, :with_retailer) }
  let!(:r1) { create(:user, :with_retailer) }
  let!(:ue1) { create(:user_extension, user: r1) }
  let!(:r2) { create(:user, :with_retailer) }
  let!(:ue2) { create(:user_extension, user: r2) }
  let!(:r3) { create(:user, :with_retailer) }
  let!(:ue3) { create(:user_extension, user: r3) }
  let!(:r4) { create(:user, :with_retailer) }
  let!(:ue4) { create(:user_extension, user: r4) }


  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'GET retailers' do

      context 'Base Search' do
        def do_request
          get :index
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(7)
          expect(hash['bodies']['total']).to eq(4)
          expect(hash['bodies']['data'].size).to eq(4)
        end
      end

      context 'Pager Search' do
        def do_request
          get :index, params: {page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(7)
          expect(hash['bodies']['total']).to eq(4)
          expect(hash['bodies']['data'].size).to eq(4)
        end
      end

      context 'Conditions Pager Search' do
        def do_request
          get :index, params: { company_name: [r1.company_name, 'like'], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(7)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end

    end

  end

end
