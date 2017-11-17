require 'spec_helper'

require 'generators/rails_base_scaffold/rails_base_scaffold_generator'

RSpec.describe RailsBaseScaffoldGenerator, :type => :generator do
  setup_default_destination

  before(:each) do
    source = File.expand_path("../../../dummy",  __FILE__)
    destination = File.expand_path("../../../../tmp",  __FILE__)

    FileUtils.cp_r("#{source}/.", destination)
  end

  describe 'with no options' do
    before { run_generator %w(post) }

    describe 'routes' do
      let(:routes) { file('config/routes.rb') }

      it { expect(routes).to contain(/resources :posts/) }
    end

    describe 'controller' do
      let(:controller) { file('app/controllers/posts_controller.rb') }

      it { expect(controller).to contain(/class PostsController/) }

      it { expect(controller).to contain(/def index/) }
      it { expect(controller).to contain(/def new/) }
      it { expect(controller).to contain(/def create/) }
      it { expect(controller).to contain(/def show/) }
      it { expect(controller).to contain(/def edit/) }
      it { expect(controller).to contain(/def update/) }
      it { expect(controller).to contain(/def destroy/) }
      it { expect(controller).to contain(/def set_post/) }
      it { expect(controller).to contain(/def model_params/) }
      it { expect(controller).to contain(/def set_posts_breadcrumbs/) }
    end

    describe 'model' do
      let(:model) { file('app/models/post.rb') }

      it { expect(model).to contain(/class Post < ApplicationRecord/) }
    end

    describe 'views' do
      let(:_form) { file('app/views/posts/_form.html.slim') }
      let(:edit) { file('app/views/posts/edit.html.slim') }
      let(:index) { file('app/views/posts/index.html.slim') }
      let(:new) { file('app/views/posts/new.html.slim') }
      let(:show) { file('app/views/posts/show.html.slim') }

      it { expect(_form).to contain(/simple_form_for @post/) }
      it { expect(edit).to contain(/model: Post.model_name.human/) }
      it { expect(index).to contain(/Post.model_name.human.pluralize/) }
      it { expect(index).to contain(/new_post_path/) }
      it { expect(new).to contain(/model: Post.model_name.human/) }
      it { expect(show).to contain(/edit_post_path\(@post\)/) }
    end

    describe 'specs' do
      let(:controller_spec) { file('spec/controllers/posts_controller_spec.rb') }
      let(:factories) { file('spec/factories/posts.rb') }
      let(:model_spec) { file('spec/models/post_spec.rb') }

      it { expect(controller_spec).to contain(/RSpec.describe PostsController/) }
      it { expect(factories).to contain(/factory :post/) }
      it { expect(model_spec).to contain(/RSpec.describe Post/) }
    end
  end

  describe 'with --admin=true' do
    before { run_generator %w(post --admin=true) }

    describe 'routes' do
      let(:routes) { file('config/routes.rb') }

      it { expect(routes).to contain(/namespace :admin/) }
      it { expect(routes).to contain(/resources :posts/) }
    end

    describe 'controller' do
      let(:controller) { file('app/controllers/admin/posts_controller.rb') }

      it { expect(controller).to contain(/class Admin::PostsController/) }

      it { expect(controller).to contain(/def index/) }
      it { expect(controller).to contain(/def new/) }
      it { expect(controller).to contain(/def create/) }
      it { expect(controller).to contain(/def show/) }
      it { expect(controller).to contain(/def edit/) }
      it { expect(controller).to contain(/def update/) }
      it { expect(controller).to contain(/def destroy/) }
      it { expect(controller).to contain(/def set_post/) }
      it { expect(controller).to contain(/def model_params/) }
      it { expect(controller).to contain(/def set_posts_breadcrumbs/) }
    end

    describe 'views' do
      let(:_form) { file('app/views/admin/posts/_form.html.slim') }
      let(:edit) { file('app/views/admin/posts/edit.html.slim') }
      let(:index) { file('app/views/admin/posts/index.html.slim') }
      let(:new) { file('app/views/admin/posts/new.html.slim') }
      let(:show) { file('app/views/admin/posts/show.html.slim') }

      it { expect(_form).to contain(/simple_form_for \[:admin, @post\]/) }
      it { expect(edit).to contain(/model: Post.model_name.human/) }
      it { expect(index).to contain(/Post.model_name.human.pluralize/) }
      it { expect(index).to contain(/new_admin_post_path/) }
      it { expect(new).to contain(/model: Post.model_name.human/) }
      it { expect(show).to contain(/edit_admin_post_path\(@post\)/) }
    end

    describe 'specs' do
      let(:controller_spec) { file('spec/controllers/admin/posts_controller_spec.rb') }
      let(:factories) { file('spec/factories/posts.rb') }
      let(:model_spec) { file('spec/models/post_spec.rb') }

      it { expect(controller_spec).to contain(/RSpec.describe Admin::PostsController/) }
      it { expect(factories).to contain(/factory :post/) }
      it { expect(model_spec).to contain(/RSpec.describe Post/) }
    end
  end
end
