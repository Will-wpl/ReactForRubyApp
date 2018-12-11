class ContractJob < ApplicationJob
  queue_as :contract

  def perform(*args)
    auction_contract_list = AuctionContract.find_by_sql ["
                              SELECT
                                ars.auction_id,
                                ac.name,
                                acs.contract_duration,
                                acs.contract_period_end_date,
                                to_char(acs.contract_period_end_date,'DD Mon YYYY') contract_period_end_date_strftime
                              FROM
                                auction_contracts acs,
                                auction_result_contracts ars,
                                auctions ac
                              WHERE
                                acs.contract_period_end_date <= ( CURRENT_DATE + ? )
                                AND ( acs.auction_id, acs.contract_duration ) = ( ars.auction_id, ars.contract_duration )
                                AND ars.status = 'win'
                                AND ars.auction_id = ac.id
                              ORDER BY acs.contract_period_end_date", args[0]['expiration_days']]
    data_list = []
    auction_contract_list.each do |item|
      data_list.push({'id':item['id'],
                         'name':item['name'],
                         'contract_duration': item['contract_duration'],
                         'contract_period_end_date':item['contract_period_end_date_strftime']})
    end
    User.admins.each do |admin_user|
      UserMailer.contract_notification(admin_user,  data_list).deliver_later
    end
  end
end