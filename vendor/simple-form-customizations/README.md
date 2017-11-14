![Build Status](https://build-status-service.apps.vpcf-qa.in.spdigital.io/jenkins?job=ArchitectureProcesses,simple-form-customization,master)

# SimpleFormCustomizations

This gem contains all Simple Form's customisations for SP Digital.

## Usage

```ruby
# Gemfile

source 'http://nexus.in.spdigital.io/repository/rubygems-all/'

gem 'simple_form'
gem 'simple_form_customizations'
```

### Horizontal Form

Forms defaults to horizontal form.
```
= simple_form_for @resource do |f|
  = f.input :input1
  = f.input :input2, as: :boolean
  = f.input :input3, collection: [1,2,3]
  = f.input :input4, collection: [1,2,3], as: :check_boxes
  = f.input :input5, collection: [1,2,3], as: :radio_buttons
  = f.input :input6, as: :file
```

### Vertical Form
As forms defaults to horizontal form, you need to explicitly specify form wrapper as `:vertical_form`, and also specify all the contained inputs with the corresponding vertical wrapper.
```
= simple_form_for @resource, wrapper: :vertical_form do |f|
  = f.input :input1
  = f.input :input2, as: :boolean, wrapper: vertical_boolean
  = f.input :input3, collection: [1,2,3], wrapper: :vertical_collection_select_input
  = f.input :input4, collection: [1,2,3], as: :check_boxes, wrapper: :vertical_radio_and_checkboxes
  = f.input :input5, collection: [1,2,3], as: :radio_buttons, wrapper: :vertical_radio_and_checkboxes 
  = f.input :input6, as: :file, wrapper: :vertical_file_input
```

## Contributing

1. Create your feature branch (git checkout -b my-new-feature)
2. Commit your changes (git commit -am 'Add some feature')
3. Push to the branch (git push origin my-new-feature)
4. Create a new Pull Request

## Maintainer
- Tay Kang Sheng

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

