require "rails_helper"

RSpec.describe Admin::ArrangementsController, type: :controller do

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
      post :create, params: { arrangement: params }
    end

    context "success" do
      let(:params) { attributes_for(:arrangement) }

      xit "creates new arrangement" do
        expect { do_request }.to change(Arrangement, :count).by(1)

        params.each do |attr, value|
          expect(Arrangement.last.send(attr)).to eq value
        end
      end

      xit "redirects" do
        do_request
        expect(response).to redirect_to admin_arrangement_path(Arrangement.last)
      end
    end

    context "failure" do
      let(:params) { Hash(name: nil) }

      xit "does not create arrangement" do
        expect { do_request }.not_to change(Arrangement, :count)
      end

      xit "renders new" do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe "#show" do
    let(:arrangement) { create(:arrangement) }

    def do_request
      get :show, params: { id: arrangement.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#edit" do
    let(:arrangement) { create(:arrangement) }

    def do_request
      get :edit, params: { id: arrangement.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#update" do
    let(:arrangement) { create(:arrangement) }

    def do_request
      patch :update, params: { id: arrangement.id, arrangement: params }
    end

    before { do_request }

    context "success" do
      let(:params) { Hash(id: arrangement.id, name: arrangement.name + "-modified") }

      before { do_request }

      xit { expect(Arrangement.last.name).to match "-modified" }
      xit { expect(response).to redirect_to admin_arrangement_path(Arrangement.last) }
    end

    context "failure" do
      let(:params) { Hash(name: "") }

      it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
    end
  end

  describe "#destroy" do
    let!(:arrangement) { create(:arrangement) }

    def do_request
      delete :destroy, params: { id: arrangement.id }
      end

      xit "deletes a arrangement" do
        expect { do_request }.to change(Arrangement, :count).by(-1)
    end

    xit "redirects" do
      do_request
      expect(response).to redirect_to admin_arrangements_path
    end
  end
end
