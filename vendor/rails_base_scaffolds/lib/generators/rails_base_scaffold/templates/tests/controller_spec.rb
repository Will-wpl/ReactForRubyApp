require "rails_helper"

<% module_namespacing do -%>
RSpec.describe <%= prefix_controller_class_name %>Controller, type: :controller do
  <%- if admin? -%>

  before { sign_in create(:user, :with_admin) }

  <%- end -%>
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
      post :create, params: { <%= file_name %>: params }
    end

    context "success" do
      let(:params) { attributes_for(:<%= singular_table_name %>) }

      xit "creates new <%= file_name %>" do
        expect { do_request }.to change(<%= class_name %>, :count).by(1)

        params.each do |attr, value|
          expect(<%= class_name %>.last.send(attr)).to eq value
        end
      end

      xit "redirects" do
        do_request
        expect(response).to redirect_to <%= singular_resource_path %>_path(<%= class_name %>.last)
      end
    end

    context "failure" do
      let(:params) { Hash(name: nil) }

      xit "does not create <%= file_name %>" do
        expect { do_request }.not_to change(<%= class_name %>, :count)
      end

      xit "renders new" do
        do_request
        expect(response.status).to eq 200 # render current action (with the same form) and not redirect
      end
    end
  end

  describe "#show" do
    let(:<%= file_name %>) { create(:<%= file_name %>) }

    def do_request
      get :show, params: { id: <%= file_name %>.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#edit" do
    let(:<%= file_name %>) { create(:<%= file_name %>) }

    def do_request
      get :edit, params: { id: <%= file_name %>.id }
    end

    before { do_request }

    xit { expect(response).to be_success }
  end

  describe "#update" do
    let(:<%= file_name %>) { create(:<%= file_name %>) }

    def do_request
      patch :update, params: { id: <%= file_name %>.id, <%= file_name %>: params }
    end

    before { do_request }

    context "success" do
      let(:params) { Hash(id: <%= file_name %>.id, name: <%= file_name %>.name + "-modified") }

      before { do_request }

      xit { expect(<%= class_name %>.last.name).to match "-modified" }
      xit { expect(response).to redirect_to <%= singular_resource_path %>_path(<%= class_name %>.last) }
    end

    context "failure" do
      let(:params) { Hash(name: "") }

      it { expect(response.status).to eq 200 } # render current action (with the same form) and not redirect
    end
  end

  describe "#destroy" do
    let!(:<%= file_name %>) { create(:<%= file_name %>) }

    def do_request
      delete :destroy, params: { id: <%= file_name %>.id }
      end

      xit "deletes a <%= file_name %>" do
        expect { do_request }.to change(<%= class_name %>, :count).by(-1)
    end

    xit "redirects" do
      do_request
      expect(response).to redirect_to <%= plural_resource_path %>_path
    end
  end
end
<% end -%>
