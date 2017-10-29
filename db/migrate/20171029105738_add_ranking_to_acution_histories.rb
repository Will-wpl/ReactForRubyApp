class AddRankingToAcutionHistories < ActiveRecord::Migration[5.1]
  def change
    add_column :auction_histories, :ranking, :integer
  end
end
