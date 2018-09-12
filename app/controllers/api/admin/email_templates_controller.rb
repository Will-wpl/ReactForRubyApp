class Api::Admin::EmailTemplatesController < Api::BaseController
  before_action :admin_required
  # skip_before_action :verify_authenticity_token

  def index
    render json: EmailTemplate.all.order(:id), status: 200
  end

  def show
    id = params[:id]
    template = EmailTemplate.find_by id: id
    render json: template, status: 200
  end

  def update
    id = params[:id]
    return render json: nil, status: 400 if id.nil?
    template = EmailTemplate.find_by(id: id)
    return render json: nil, status: 400 if template.nil?

    template.update(subject: params[:subject], body: params[:body])
    render json: nil, status: 200
  end


end