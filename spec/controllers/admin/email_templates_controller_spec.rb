require "rails_helper"

RSpec.describe Admin::EmailTemplatesController, type: :controller do

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
      post :create, params: { email_template: params }
    end

    context "success" do
      let(:params) { attributes_for(:email_template) }

      xit "creates new email_template" do
        expect { do_request }.to change(EmailTemplate, :count).by(1)

        params.each do |attr, value|
          expect(EmailTemplate.last.send(attr)).to eq value
        end
      end

      xit "redirects" do
        do_request
        expect(response).to redirect_to admin_email_template_path(EmailTemplate.last)
      end
    end

    context "failure" do
      let(:params) { Hash(name: nil) }

      xit "does not create email_template" do
        expect { do_request }.not_to change(EmailTemplate, :count)
      end

      xit "renders new" do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe "#show" do
    let(:email_template) { create(:email_template) }

    def do_request
      get :show, params: { id: email_template.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#edit" do
    let(:email_template) { create(:email_template) }

    def do_request
      get :edit, params: { id: email_template.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#update" do
    let(:email_template) { create(:email_template) }

    def do_request
      patch :update, params: { id: email_template.id, email_template: params }
    end

    before { do_request }

    context "success" do
      let(:params) { Hash(id: email_template.id, name: email_template.name + "-modified") }

      before { do_request }

      xit { expect(EmailTemplate.last.name).to match "-modified" }
      xit { expect(response).to redirect_to admin_email_template_path(EmailTemplate.last) }
    end

    context "failure" do
      let(:params) { Hash(name: "") }

      it { expect(response.status).to eq 302 } # render current action (with the same form) and not redirect
    end
  end

  describe "#destroy" do
    let!(:email_template) { create(:email_template) }

    def do_request
      delete :destroy, params: { id: email_template.id }
      end

      xit "deletes a email_template" do
        expect { do_request }.to change(EmailTemplate, :count).by(-1)
    end

    xit "redirects" do
      do_request
      expect(response).to redirect_to admin_email_templates_path
    end
  end
end
