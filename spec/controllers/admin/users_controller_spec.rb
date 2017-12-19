require 'rails_helper'

RSpec.describe Admin::UsersController, type: :controller do
  before { sign_in create(:user, :with_admin) }

  describe '#index' do
    def do_request
      get :index
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#new' do
    def do_request
      get :new
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#create' do
    def do_request
      post :create, params: { user: params }
    end

    context 'success' do
      let(:params) { attributes_for(:user).merge!(role_ids: Role.where(name: :admin).pluck(:id)) }

      it 'creates new user' do
        expect { do_request }.to change(User, :count).by(1)

        params.except(:password, :password_confirmation).each do |attr, value|
          expect(User.last.send(attr)).to eq value
        end

        expect(User.last.roles.pluck(:name)).to eq ['admin']
      end

      it 'redirects' do
        do_request
        expect(response).to redirect_to admin_user_path(User.last)
      end
    end

    context 'failure' do
      let(:params) { Hash(password: '') }

      it 'does not create user' do
        expect { do_request }.not_to change(User, :count)
      end

      it 'renders new' do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe '#show' do
    let(:user) { create(:user) }

    def do_request
      get :show, params: { id: user.id }
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#edit' do
    let(:user) { create(:user) }

    def do_request
      get :edit, params: { id: user.id }
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#update' do
    let(:user) { create(:user) }

    def do_request
      patch :update, params: { id: user.id, user: params }
    end

    before { do_request }

    context 'success' do
      let(:params) { Hash(id: user.id, name: user.name + '-modified', password: '') }

      before { do_request }

      it { expect(User.last.name).to match '-modified' }
      it { expect(response).to redirect_to admin_user_path(User.last) }
    end

    context 'failure' do
      let(:params) { Hash(name: '') }

      it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
    end
  end

  describe '#destroy' do
    let!(:user) { create(:user) }

    def do_request
      delete :destroy, params: { id: user.id }
    end

    it 'deletes a user' do
      expect { do_request }.to change(User, :count).by(-1)
    end

    it 'redirects' do
      do_request
      expect(response).to redirect_to admin_users_path
    end
  end

  describe '#retailers' do
    let!(:retailer) { create(:user, :with_retailer) }
    let!(:retailer_detail) { create(:user_detail, user: retailer) }
    def do_request
      get :retailers
    end

    before { do_request }

    it { expect(response).to be_success }
  end

  describe '#buyers' do
    let!(:buyer) { create(:user, :with_buyer) }
    let!(:buyer_detail) { create(:user_detail, :with_company_buyer, user: buyer) }
    def do_request
      get :buyers
    end

    before { do_request }
    it { expect(response).to be_success }
  end
end
