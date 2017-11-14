SimpleForm.setup do |config|
  config.wrappers :vertical_boolean, tag: 'div', class: 'lm--formItem', error_class: 'is-error' do |wr|
    wr.use :html5
    wr.optional :readonly
    wr.use :input, class: 'lm--checkbox-input'
    wr.use :label, class: 'lm--checkbox-label'

    wr.use :error, wrap_with: { tag: 'span', class: 'help-block' }
    wr.use :hint,  wrap_with: { tag: 'p', class: 'help-block' }
  end
end
