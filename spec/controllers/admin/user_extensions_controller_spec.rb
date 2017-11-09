require "rails_helper"

RSpec.describe Admin::UserExtensionsController, type: :controller do

  before { sign_in create(:user, :with_admin) }

  describe "#index" do
    def do_request
      get :index
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#new" do
    def do_request
      get :new
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#create" do
    def do_request
      post :create, params: { user_extension: params }
    end

    context "success" do
      let(:params) { attributes_for(:user_extension) }

      xit "creates new user_extension" do
        expect { do_request }.to change(UserExtension, :count).by(1)

        params.each do |attr, value|
          expect(UserExtension.last.send(attr)).to eq value
        end
      end

      xit "redirects" do
        do_request
        expect(response).to redirect_to admin_user_extension_path(UserExtension.last)
      end
    end

    context "failure" do
      let(:params) { Hash(name: nil) }

      xit "does not create user_extension" do
        expect { do_request }.not_to change(UserExtension, :count)
      end

      xit "renders new" do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe "#show" do
    let(:user_extension) { create(:user_extension) }

    def do_request
      get :show, params: { id: user_extension.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#edit" do
    let(:user_extension) { create(:user_extension) }

    def do_request
      get :edit, params: { id: user_extension.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#update" do
    let(:user_extension) { create(:user_extension) }

    def do_request
      patch :update, params: { id: user_extension.id, user_extension: params }
    end

    before { do_request }

    context "success" do
      let(:params) { Hash(id: user_extension.id, name: user_extension.name + "-modified") }

      before { do_request }

      xit { expect(UserExtension.last.name).to match "-modified" }
      xit { expect(response).to redirect_to admin_user_extension_path(UserExtension.last) }
    end

    context "failure" do
      let(:params) { Hash(name: "") }

      it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
    end
  end

  describe "#destroy" do
    let!(:user_extension) { create(:user_extension) }

    def do_request
      delete :destroy, params: { id: user_extension.id }
      end

      xit "deletes a user_extension" do
        expect { do_request }.to change(UserExtension, :count).by(-1)
    end

    xit "redirects" do
      do_request
      expect(response).to redirect_to admin_user_extensions_path
    end
  end
end
