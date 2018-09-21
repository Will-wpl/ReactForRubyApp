namespace :rich_template do
  desc "Rich template init"

  task :init => :environment do
    rich_templates = [
        {type: 1},
        {type: 2},
        {type: 3},

    ]

    TEMPLATE_HASH = {"1" => 'letter_of_award_template.html', '2' => 'letter_of_award_template_nominated_entity.html', '3' => 'advisory_template.html'}.freeze
    rich_templates.each do |template|
      RichTemplate.find_or_create_by(type: template[:type]) do |this_template|
        this_template.type = template[:type]
        template_file = Rails.root.join('app', 'assets', 'templates', TEMPLATE_HASH[template[:type].to_s])
        file_content = nil
        file_content = File.read(template_file) if File.exist?(template_file)
        this_template.content = file_content
      end
    end

  end


  task :seed => [:environment, :init] do
    parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
    entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last
    AuctionResultContract.where(parent_template_id: nil).update(parent_template_id: parent_template.id) if parent_template
    AuctionResultContract.where(entity_template_id: nil).update(entity_template_id: entity_template.id) if entity_template
  end
end
