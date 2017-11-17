Dir[File.expand_path('../inputs/*.rb', __FILE__)].each { |f| require f }
Dir[File.expand_path('../wrappers/*.rb', __FILE__)].each { |f| require f }
Dir[File.expand_path('../tags/*.rb', __FILE__)].each { |f| require f }

SimpleForm.setup do |config|
  # Defaults
  config.default_wrapper  = :horizontal_form
  config.wrapper_mappings =
    {
      check_boxes: :horizontal_radio_and_checkboxes,
      radio_buttons: :horizontal_radio_and_checkboxes,
      boolean: :horizontal_boolean,
      file: :horizontal_file_input,
      select: :horizontal_collection_select_input
    }
  config.item_wrapper_tag       = :div
  config.item_wrapper_class     = 'lm--formItem-option'
  config.boolean_style          = :inline
  config.button_class           = 'lm--button'
end

require 'simple_form/tags'
SimpleForm::Tags::CollectionCheckBoxes.prepend SimpleFormCustomizations::Tags::CollectionCheckBoxes
SimpleForm::Tags::CollectionRadioButtons.prepend SimpleFormCustomizations::Tags::CollectionRadioButtons
