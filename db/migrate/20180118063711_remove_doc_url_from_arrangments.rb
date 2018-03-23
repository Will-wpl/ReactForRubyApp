class RemoveDocUrlFromArrangments < ActiveRecord::Migration[5.1]
  def change
    remove_column :arrangements, :specifications_doc_url, :string
    remove_column :arrangements, :briefing_pack_doc_url, :string
  end
end
