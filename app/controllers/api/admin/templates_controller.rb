class Api::Admin::TemplatesController < Api::BaseController
  before_action :admin_required
  # skip_before_action :verify_authenticity_token

  def list
    id = params[:id]
    templates = []
    if id.to_i == RichTemplate::LETTER_OF_AWARD_TEMPLATE
      parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
      entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last

      templates.push({id: parent_template.id, name: parent_template.name, type: parent_template.type, updated_at: parent_template.updated_at}) if parent_template
      templates.push({id: entity_template.id, name: entity_template.name, type: entity_template.type, updated_at: entity_template.updated_at}) if entity_template

    end
    render json: templates, status: 200
  end

  def show
    type = params[:id]
    template = get_template_content type

    render json:template, status: 200
  end

  def update
    type = params[:id]
    body = params[:body]
    return render json: nil, status: 400 if type.nil? || body.nil?

    if type.to_i == RichTemplate::LETTER_OF_AWARD_TEMPLATE || type.to_i == RichTemplate::NOMINATED_ENTITY_TEMPLATE
      template = RichTemplate.new
      template.type = type
      template.content = body
      template.save
    else
      template = RichTemplate.find_by(type: type)
      return render json: nil, status: 400 if template.nil?
      template.update(content: body)
    end

    render json: nil, status: 200
  end

  private


  def get_template_content(type)
    content = ''
    if type.to_i == RichTemplate::LETTER_OF_AWARD_TEMPLATE || type.to_i === RichTemplate::NOMINATED_ENTITY_TEMPLATE
      template = RichTemplate.where(type: type).last
    else
      template = RichTemplate.find_by type: type
    end
    content = template.content unless template.nil?
    content
  end
end
