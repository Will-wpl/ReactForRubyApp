class Api::Admin::LaTemplatesController < Api::BaseController
  before_action :admin_required
  # skip_before_action :verify_authenticity_token

  PARENT_ENTITY = '1'.freeze

  def show
    id = params[:id]
    template = nil
    if id == PARENT_ENTITY
      template = get_template_content 'letter_of_award_template.html'
    else
      template = get_template_content 'letter_of_award_template_nominated_entity.html'
    end

    render json:template, status: 200
  end

  def update
    id = params[:id]
    body = params[:body]
    return render json: nil, status: 400 if id.nil?

    if id == PARENT_ENTITY
      filename = 'letter_of_award_template.html'
    else
      filename = 'letter_of_award_template_nominated_entity.html'
    end
    lafile = File.new(Rails.root.join('app', 'assets', 'pdf', filename), "w+")
    if lafile
      lafile.syswrite("#{body}")
    end
    render json: nil, status: 200
  end

  private


  def get_template_content(filename)
    template_file = Rails.root.join('app', 'assets', 'pdf', filename)
    file_content = nil
    file_content = File.read(template_file) if File.exist?(template_file)
    file_content
  end
end
