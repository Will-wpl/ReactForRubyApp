namespace :rich_template do
  desc "Rich template init"
  TEMPLATE_HASH = {"1" => 'letter_of_award_template.html', '2' => 'letter_of_award_template_nominated_entity.html', '3' => 'advisory_template.html'}.freeze
  task :init => :environment do
    rich_templates = [
        {type: 1, name: 'Parent LA template'},
        {type: 2, name: 'Nominated LA template'},
        {type: 3, name: 'Buyer Market Insights'},

    ]
    rich_templates.each do |template|
      RichTemplate.find_or_create_by(type: template[:type]) do |this_template|
        this_template.type = template[:type]
        this_template.content = get_file_content(Rails.root.join('app', 'assets', 'templates', TEMPLATE_HASH[template[:type].to_s]))
        this_template.name = template[:name]
      end
    end
  end


  task :seed => [:environment, :init] do
    parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
    entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last
    AuctionResultContract.where(parent_template_id: nil).update(parent_template_id: parent_template.id) if parent_template
    AuctionResultContract.where(entity_template_id: nil).update(entity_template_id: entity_template.id) if entity_template
  end

  # task :delete => [:environment] do
  #   RichTemplate.delete_all
  # end

  # task :reset => [:environment, :delete, :seed]
  task :update_name => [:environment] do
    RichTemplate.where(type: RichTemplate::ADVISORY_TEMPLATE).update_all name: 'Buyer Market Insights'
  end

  task :update_template_id => [:environment] do
    parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
    entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last
    AuctionResultContract.update_all(parent_template_id: parent_template.id) if parent_template
    AuctionResultContract.update_all(entity_template_id: entity_template.id) if entity_template
  end

  task :reset_last_template => [:environment] do
    parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
    entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last
    parent_template.update(content: get_file_content(Rails.root.join('app', 'assets', 'templates', TEMPLATE_HASH['1']))) if parent_template
    entity_template.update(content: get_file_content(Rails.root.join('app', 'assets', 'templates', TEMPLATE_HASH['2']))) if entity_template
  end

  private
  def get_file_content(filename)
    file_content = nil
    file_content = File.read(filename) if File.exist?(filename)
    file_content
  end

end
