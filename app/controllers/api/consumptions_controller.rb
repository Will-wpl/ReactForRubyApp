class Api::ConsumptionsController < Api::BaseController
  before_action :set_consumption, only: %i[show update_status destroy acknowledge]

  def index
    consumptions = Consumption.find_by_user_consumer_type(params[:consumer_type]).find_by_auction_id(params[:id]).is_participation.is_accpet
    unless params[:contract_duration].blank?
      consumptions = consumptions.where('contract_duration = ?', params[:contract_duration])
    end
    consumptions = (params[:consumer_type] == '2') ? consumptions.order('users.company_name asc') : consumptions.order('users.name asc')
    auction = Auction.find(params[:id])
    auction_finished = !auction.auction_result.blank?
    auction_published = auction.publish_status == '1' ? true : false
    data = []
    total_info = { consumption_count: 0, account_count: 0, lt_peak: 0, lt_off_peak: 0,
                   hts_peak: 0, hts_off_peak: 0, htl_peak: 0, htl_off_peak: 0, eht_peak: 0, eht_off_peak: 0 }
    consumptions.each do |consumption|
      next if current_user&.has_role?(:admin) && consumption.accept_status != Consumption::AcceptStatusApproved
      details = ConsumptionDetail.find_by_consumption_id(consumption.id).order(account_number: :asc)
      details_array = consumption_details(details)
      count = details.count
      entities = CompanyBuyerEntity.find_by_user(consumption.user_id)
      auction_contract = auction.auction_contracts.where(contract_duration: consumption.contract_duration).take
      data.push(id: consumption.id, auction_id: consumption.auction_id, user_id: consumption.user_id,
                company_name: consumption.user.company_name, name: consumption.user.name, count: count,
                consumption: consumption,
                contract_period: get_contract_period(auction,auction_contract,consumption),
                lt_peak: Consumption.get_lt_peak(consumption.lt_peak),
                lt_off_peak: Consumption.get_lt_off_peak(consumption.lt_off_peak),
                hts_peak: Consumption.get_hts_peak(consumption.hts_peak),
                hts_off_peak: Consumption.get_hts_off_peak(consumption.hts_off_peak),
                htl_peak: Consumption.get_htl_peak(consumption.htl_peak),
                htl_off_peak: Consumption.get_htl_off_peak(consumption.htl_off_peak),
                eht_peak: Consumption.get_eht_peak(consumption.eht_peak),
                eht_off_peak: Consumption.get_eht_off_peak(consumption.eht_off_peak),
                details: consumption.contract_duration.blank? ? details : details_array,
                entities: entities)
      total_info[:consumption_count] += 1
      total_info[:account_count] += count
      total_info[:lt_peak] += Consumption.get_lt_peak(consumption.lt_peak)
      total_info[:lt_off_peak] += Consumption.get_lt_off_peak(consumption.lt_off_peak)
      total_info[:hts_peak] += Consumption.get_hts_peak(consumption.hts_peak)
      total_info[:hts_off_peak] += Consumption.get_hts_off_peak(consumption.hts_off_peak)
      total_info[:htl_peak] += Consumption.get_htl_peak(consumption.htl_peak)
      total_info[:htl_off_peak] += Consumption.get_htl_off_peak(consumption.htl_off_peak)
      total_info[:eht_peak] += Consumption.get_eht_peak(consumption.eht_peak)
      total_info[:eht_off_peak] += Consumption.get_eht_off_peak(consumption.eht_off_peak)

    end
    render json: { list: data, total_info: total_info, auction_finished: auction_finished, auction_published: auction_published }, status: 200
  end

  def show
    consumption = @consumption
    details = ConsumptionDetail.find_by_consumption_id(params[:id]).order(id: :asc)
    details_array = consumption_details(details)
    auction = consumption.auction
    auction_contract = auction.auction_contracts.where(contract_duration: consumption.contract_duration).take
    auction_finished = !auction.auction_result.blank?
    auction_published = auction.publish_status
    count = details.count
    entities = CompanyBuyerEntity.find_by_user(consumption.user_id)
    cons = { auction_id: consumption.auction_id,
             user_id: consumption.user_id,
             company_name: consumption.user.company_name,
             name: consumption.user.name,
             consumption: consumption,
             auction_finished: auction_finished,
             auction_published: auction_published,
             contract_period: get_contract_period(auction,auction_contract,consumption),
             count: count,
             lt_peak: Consumption.get_lt_peak(consumption.lt_peak),
             lt_off_peak: Consumption.get_lt_off_peak(consumption.lt_off_peak),
             hts_peak: Consumption.get_hts_peak(consumption.hts_peak),
             hts_off_peak: Consumption.get_hts_off_peak(consumption.hts_off_peak),
             htl_peak: Consumption.get_htl_peak(consumption.htl_peak),
             htl_off_peak: Consumption.get_htl_off_peak(consumption.htl_off_peak),
             eht_peak: Consumption.get_eht_peak(consumption.eht_peak),
             eht_off_peak: Consumption.get_eht_off_peak(consumption.eht_off_peak),
             details: consumption.contract_duration.blank? ? details : details_array,
             accept_status: consumption.accept_status,
             approval_date_time: consumption.approval_date_time,
             entities: entities }

    render json: cons, status: 200
  end

  def update_status
    if params[:id] == '0'
      if Consumption.find_by_auction_and_user(params[:auction_id], params[:user_id]).exists?
        render json: { message: 'consumption exist' }, status: 200
      else
        if auction.buyer_type == Auction::SingleBuyerType
          auction.consumptions.find_by_user_consumer_type(User::ConsumerTypeCompany).destroy_all
        end
        @consumption = Consumption.new
        @consumption.auction_id = params[:auction_id]
        @consumption.user_id = params[:user_id]
        @consumption.action_status = Consumption::ActionStatusPending
        @consumption.participation_status = Consumption::ParticipationStatusPending
        #update - new field (20180711) - Start
        # @consumption.accept_status = Consumption::AcceptStatusPending
        #update - new field (20180711) - End
        @consumption.save
        render json: @consumption, status: 201
      end
    else
      if params['action_status'] == '1'
        @consumption.update(action_status: params['action_status'])
        render json: @consumption, status: 200
      else
        @consumption.destroy
        render json: nil, status: 200
      end
    end
  end

  def destroy
    @consumption.destroy
    render json: nil, status: 200
  end

  def acknowledge
    @consumption.acknowledge = Consumption::Acknowledged
    @consumption.save
    render json: { acknowledge: @consumption.acknowledge }, status: 200
  end

  def acknowledge_all
    data = []
    Consumption.find(params[:ids]).each do |consumption|
      consumption.acknowledge = Consumption::Acknowledged
      consumption.save
      data.push(id: consumption.id, acknowledge: consumption.acknowledge)
    end

    render json: data, status: 200
  end

  private

  def consumption_details(consumption_details)
    consumption_details_all = []
    consumption_details.each do |consumption_detail|
      # if consumption_detail.user_attachment_id.blank?
      #   user_attachment = nil
      # else
      #   user_attachment = UserAttachment.find_by_id(consumption_detail.user_attachment_id)
      # end
      user_attachments = UserAttachment.find_consumption_attachment_by_user_type(consumption_detail.id, consumption_detail.consumption.user_id, UserAttachment::FileType_Consumption_Detail_Doc)
      attachment_ids = []
      user_attachments.each{ |x| attachment_ids.push(x.id) }
      final_detail = {
          "id" => consumption_detail.id,
          "account_number" => consumption_detail.account_number,
          "intake_level" => consumption_detail.intake_level,
          "peak" => consumption_detail.peak,
          "off_peak" => consumption_detail.off_peak,
          "consumption_id" => consumption_detail.consumption_id,
          "created_at" => consumption_detail.created_at,
          "updated_at" => consumption_detail.updated_at,
          "premise_address" => consumption_detail.premise_address,
          "contracted_capacity" => consumption_detail.contracted_capacity,
          "existing_plan" => consumption_detail.existing_plan,
          "contract_expiry" => consumption_detail.contract_expiry,
          "blk_or_unit" => consumption_detail.blk_or_unit,
          "street" => consumption_detail.street,
          "unit_number" => consumption_detail.unit_number,
          "postal_code" => consumption_detail.postal_code,
          "totals" => consumption_detail.totals,
          "peak_pct" => consumption_detail.peak_pct,
          "company_buyer_entity_id" => consumption_detail.company_buyer_entity_id,
          "user_attachment" => user_attachments,
          "attachment_ids" => attachment_ids.to_json
      }
      consumption_details_all.push(final_detail)
    end
    consumption_details_all
  end

  def set_consumption
    if current_user.has_role?('admin') || current_user.has_role?('retailer')
      @consumption = Consumption.admin_find_by_id(params[:id]) unless params[:id] == '0'
    else
      @consumption = current_user_consumption
    end
  end

  def current_user_consumption
    consumptions = current_user.consumptions
    consumption = if consumptions.count > 0
                    consumptions.find(params[:id]) unless params[:id] == '0'
                  end
    consumption
  end

  def get_contract_period(auction, auction_contract, consumption)
    if auction_contract.nil?
      "#{auction.contract_period_start_date.strftime('%d %b %Y')} to #{auction.contract_period_end_date.strftime('%d %b %Y')}"
    else
      "#{consumption.contract_duration} months: #{auction.contract_period_start_date.strftime('%d %b %Y')} to #{auction_contract.contract_period_end_date.strftime('%d %b %Y')}"
    end
  end

end
