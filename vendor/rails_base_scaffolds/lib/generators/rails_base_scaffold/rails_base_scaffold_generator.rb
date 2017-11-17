require 'rails/generators/named_base'
require 'rails/generators/resource_helpers'

require_relative '../my_orm/my_orm_generator'

class RailsBaseScaffoldGenerator < Rails::Generators::NamedBase
  include Rails::Generators::ResourceHelpers

  source_root File.expand_path('../templates', __FILE__)

  class_option :admin, type: :boolean, default: false, desc: 'Admin Controller'
  class_option :orm, default: 'active_record'

  argument :attributes, type: :array, default: [], banner: 'field:type field:type'

  hook_for :resource_route,
           in: :rails, required: true do |resource_route|
    invoke resource_route, [prefix_controller_class_name]
  end

  invoke :my_orm

  def create_controller_files
    template 'controllers/controller.rb',
             File.join('app/controllers', prefix, class_path, "#{controller_file_name}_controller.rb")
  end

  def create_test_files
    template 'tests/controller_spec.rb',
             File.join('spec/controllers', prefix, controller_class_path, "#{controller_file_name}_controller_spec.rb")
  end

  def copy_view_files
    available_views.each do |view|
      filename = filename_with_extensions view
      template "views/#{view}.html.slim", File.join('app', 'views', prefix, controller_file_path, filename)
    end
  end

  protected

  def admin?
    options[:admin]
  end

  def prefix
    if admin?
      'admin'.freeze
    else
      ''.freeze
    end
  end

  def parent
    if admin?
      'Admin::Base'.freeze
    else
      'Application'.freeze
    end
  end

  def prefix_controller_class_name
    if prefix.present?
      "#{prefix.capitalize}::#{controller_class_name}"
    else
      controller_class_name
    end
  end

  def parent_controller_class_name
    parent
  end

  def singular_resource_ref
    if prefix.present?
      "[:#{prefix}, @#{singular_table_name}]"
    else
      "@#{singular_table_name}"
    end
  end

  def singular_resource_path
    if prefix.present?
      "#{prefix}_#{singular_table_name}"
    else
      singular_table_name
    end
  end

  def plural_resource_path
    if prefix.present?
      "#{prefix}_#{index_helper}"
    else
      index_helper
    end
  end

  def available_views
    %w[index edit show new _form]
  end

  def filename_with_extensions(name)
    [name, format, handler].compact.join('.')
  end

  def format
    :html
  end

  def handler
    :slim
  end
end
