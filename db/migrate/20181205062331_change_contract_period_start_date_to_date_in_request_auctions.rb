class ChangeContractPeriodStartDateToDateInRequestAuctions < ActiveRecord::Migration[5.1]
  def change
    change_column :request_auctions, :contract_period_start_date, :date
  end
end
