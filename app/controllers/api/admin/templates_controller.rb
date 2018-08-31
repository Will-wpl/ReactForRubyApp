class Api::Admin::TemplatesController < Api::BaseController
  before_action :admin_required
  # skip_before_action :verify_authenticity_token


  LETTER_OF_AWARD_TEMPLATE = 1.freeze
  NOMINATED_ENTITY_TEMPLATE = 2.freeze
  ADVISORY_TEMPLATE = 3.freeze

  def show
    type = params[:id]
    template = get_template_content type

    render json:template, status: 200
  end

  def update
    type = params[:id]
    body = params[:body]
    return render json: nil, status: 400 if type.nil? || body.nil?

    template = RichTemplate.find_by(type: type)
    return render json: nil, status: 400 if template.nil?

    template.update(content: body)
    render json: nil, status: 200
  end

  private


  def get_template_content(type)
    template = RichTemplate.find_by type: type
    content = ''
    content = template.content unless template.nil?
    content
  end
end
