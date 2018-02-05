class CreateEmailTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :email_templates do |t|
      t.string :subject
      t.text :body
      t.string :template_type

      t.timestamps
    end
  end
end
