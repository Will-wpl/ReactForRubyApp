class AddNameToRichTemplate < ActiveRecord::Migration[5.1]
  def change
    add_column :rich_templates, :name, :text
  end
end
