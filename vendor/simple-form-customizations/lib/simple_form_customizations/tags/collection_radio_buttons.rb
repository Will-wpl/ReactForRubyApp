module SimpleFormCustomizations::Tags
  module CollectionRadioButtons
    def render_component(builder)
      input_html_options = builder.instance_variable_get(:@input_html_options)
      input_html_options[:class] << 'lm--radio-input'
      builder.instance_variable_set(:@input_html_options, input_html_options)

      builder.radio_button + builder.label(class: 'lm--radio-label')
    end
  end
end
