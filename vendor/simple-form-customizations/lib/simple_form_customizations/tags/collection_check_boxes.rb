module SimpleFormCustomizations::Tags
  module CollectionCheckBoxes
    def render_component(builder)
      input_html_options = builder.instance_variable_get(:@input_html_options)
      input_html_options[:class] << 'lm--checkbox-input'
      builder.instance_variable_set(:@input_html_options, input_html_options)

      builder.check_box + builder.label(class: 'lm--checkbox-label')
    end
  end
end
