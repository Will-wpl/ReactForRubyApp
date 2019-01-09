namespace :request_auction do
  desc "Buyer / Retailer log init"

  task :init => :environment do

    requests = RequestAuction.all
    requests.each do |request|
      if RequestAttachment.any?{ |x| x.request_auction_id == request.id }
        request.contract_type = '1'
      else
        request.contract_type = '2'
      end
      request.save!
    end
  end

end
