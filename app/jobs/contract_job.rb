class ContractJob < ApplicationJob
  queue_as :contract

  def perform(*args)
    buyer_list = Consumption.find_by_sql ["
                              SELECT
                                css.id,
                                css.user_id,
                                users.company_name,
                                to_char(acs.contract_period_end_date, 'DD Mon YYYY' ) contract_period_end_date
                              FROM
                                auction_contracts acs,
                                auction_result_contracts ars,
                                consumptions css,
                                users
                              WHERE
                                acs.contract_period_end_date >=  CURRENT_DATE
                                AND acs.contract_period_end_date <= ( CURRENT_DATE + ? )
                                AND ( acs.auction_id, acs.contract_duration ) = ( ars.auction_id, ars.contract_duration )
                                AND ars.status = 'win'
                                AND ( css.auction_id, css.contract_duration ) = ( acs.auction_id, acs.contract_duration )
                                AND css.user_id = users.id
                              ORDER BY
                                acs.contract_period_end_date", args[0]['expiration_days']]
    unless buyer_list.blank?
      company_name_list = []
      buyer_list.each do |item|
        #[#Buyer 1] – Expiry date: [#date of contract expiry]
        buyer_company_name = item['company_name']
        date_of_contract_expiry = item['contract_period_end_date']
        company_name_list.push("#{buyer_company_name} - Expiry date: #{date_of_contract_expiry}")
      end
      User.admins.each do |admin_user|
        UserMailer.contract_notification(admin_user,  {:days => args[0]['expiration_days'], :buyer_company_name_list => company_name_list}).deliver_later
      end
    end
  end
end