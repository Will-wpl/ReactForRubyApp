class Admin::EmailTemplatesController < Admin::BaseController
  before_action :set_email_template, only: [:show, :edit, :update, :destroy]

  before_action :set_email_templates_breadcrumbs
  before_action :set_action_breadcrumbs

  def index
    @email_templates = EmailTemplate.all.order(created_at: :desc).page(params[:page])
  end

  def new
    @email_template = EmailTemplate.new
  end

  def create
    @email_template = EmailTemplate.new(model_params)

    if @email_template.save
      redirect_to [:admin, @email_template], notice: "#{EmailTemplate.model_name.human} was successfully created."
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @email_template.update(model_params)
      redirect_to [:admin, @email_template], notice: "#{EmailTemplate.model_name.human} was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @email_template.destroy

    redirect_to admin_email_templates_path, notice: "#{EmailTemplate.model_name.human} was successfully destroyed."
  end

  private

    def set_email_template
      @email_template = EmailTemplate.find(params[:id])
    end

    def model_params
      params.require(:email_template).permit(:subject, :body, :template_type)
    end

    def set_email_templates_breadcrumbs
      add_breadcrumb 'Home', root_path
      add_breadcrumb EmailTemplate.model_name.human.pluralize, admin_email_templates_path
      add_breadcrumb @email_template.subject, admin_email_template_path(@email_template) if @email_template.try(:persisted?)
    end
end
