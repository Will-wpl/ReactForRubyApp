# Ref: http://stackoverflow.com/questions/4589078/rails3-generating-a-model-in-custom-generator
# Otherwise, my_scaffold would throw error: 'active_record [not found]'

require 'rails/generators/active_record/model/model_generator'

module Rails
  module Generators
    hide_namespace 'my_orm'

    class Railtie < ::Rails::Engine
      config.generators.orm = :my_orm
    end

    class MyOrmGenerator < ActiveRecord::Generators::ModelGenerator
      source_root "#{base_root}/active_record/model/templates"

      def create_model_file
        generate_application_record

        template_file = File.join(File.expand_path('../templates', __FILE__), 'model.rb')
        template template_file, File.join('app/models', class_path, "#{file_name}.rb")
      end
    end
  end
end
