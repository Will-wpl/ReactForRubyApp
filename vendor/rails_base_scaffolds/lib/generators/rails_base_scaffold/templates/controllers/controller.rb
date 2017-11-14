<% module_namespacing do -%>
class <%= prefix_controller_class_name %>Controller < <%= parent_controller_class_name %>Controller
  before_action :set_<%= singular_table_name %>, only: [:show, :edit, :update, :destroy]

  before_action :set_<%= plural_table_name %>_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @<%= plural_table_name %> = <%= orm_class.all(class_name) %>.order(created_at: :desc).page(params[:page])
  end

  def new
    @<%= singular_table_name %> = <%= orm_class.build(class_name) %>
  end

  def create
    @<%= singular_table_name %> = <%= orm_class.build(class_name, "model_params") %>

    if @<%= orm_instance.save %>
      redirect_to <%= singular_resource_ref %>, notice: "#{<%= class_name %>.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @<%= orm_instance.update("model_params") %>
      redirect_to <%= singular_resource_ref %>, notice: "#{<%= class_name %>.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @<%= orm_instance.destroy %>

    redirect_to <%= plural_resource_path %>_path, notice: "#{<%= class_name %>.model_name.human} was successfully destroyed."
  end

  private

    def set_<%= singular_table_name %>
      @<%= singular_table_name %> = <%= orm_class.find(class_name, "params[:id]") %>
    end

    def model_params
      <%- if attributes_names.empty? -%>
      params.require(<%= ":#{singular_table_name}" %>)
      <%- else -%>
      params.require(<%= ":#{singular_table_name}" %>).permit(<%= attributes_names.map { |name| ":#{name}" }.join(', ') %>)
      <%- end -%>
    end

    def set_<%= plural_table_name %>_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb <%= class_name %>.model_name.human.pluralize, <%= plural_resource_path %>_path
      add_breadcrumb @<%= singular_table_name %>.name_was, <%= singular_resource_path %>_path(@<%= singular_table_name %>) if @<%= singular_table_name %>.try(:persisted?)
    end
end
<% end -%>
