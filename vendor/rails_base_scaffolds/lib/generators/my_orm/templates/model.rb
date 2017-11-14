<% module_namespacing do -%>
class <%= class_name %> < <%= parent_class_name.classify %>
  # Extends

  # Includes

  # Associations
<% attributes.select(&:reference?).each do |attribute| -%>
  belongs_to :<%= attribute.name %><%= ', polymorphic: true' if attribute.polymorphic? %>
<% end -%>

  # accepts_nested_attributes

  # Validations

  # Scopes

  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)
end
<% end -%>
