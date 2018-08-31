class CreateRichTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :rich_templates do |t|
      t.integer :type
      t.text :content

      t.timestamps
    end
  end
end
