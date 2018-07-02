class Api::Admin::EmailTemplatesController < Api::BaseController
  before_action :admin_required
  # skip_before_action :verify_authenticity_token

  def index
    render json: EmailTemplate.all, status: 200
  end

  def show
    id = params[:id]
    template = EmailTemplate.find_by id: id
    render json: template, status: 200
  end

  def update
    id = params[:id]
    template = EmailTemplate.find_by(id: id)
    template.update(model_params)
    render json: nil, status: 200
  end

  private

  def model_params
    params.require(:email_template).permit(:subject, :body)
  end
end
