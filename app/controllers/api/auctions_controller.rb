class Api::AuctionsController < Api::BaseController
  before_action :set_auction, only: %i[timer]



  # account_nums = ConsumptionDetail.select(:account_number).distinct
  # account_nums.each do |account|
  #   detail = ConsumptionDetail.find_account_less_than_contract_start_date_last(search_start_date, account.account_number)
  #   account_ids.push(detail.id)
  #   buyer_ids.push(detail.consumption.user.id)
  #   accounts.push({id: detail.id, account_number: detail.account_number, intake_level: detail.intake_level,
  #                  peak: detail.peak, off_peak: detail.off_peak, contract_expiry: detail.contract_expiry,
  #                  contracted_capacity: detail.contracted_capacity, totals: detail.totals,
  #                  entity_name: detail.company_buyer_entity.company_name, ra_id: detail.consumption.auction.published_gid})
  # end

  def filter_date
    search_start_date = Date.parse(params[:date])#.advance(days: -1)
    accounts = []
    account_ids = []
    buyer_ids = []
    unless params[:sort_by].nil?
      sort_by = JSON.parse(params[:sort_by])
      sort_by = "cdf.#{sort_by[0]} #{sort_by[1]}"
    end
    details = ConsumptionDetail.find_account_less_than_contract_start_date(search_start_date, sort_by)
    details.each do |detail|
      account_ids.push(detail.id)
      buyer_ids.push(detail.buyer_id) unless buyer_ids.include?(detail.buyer_id)
      accounts.push(detail)
    end
    render json: {accounts: accounts, account_ids: account_ids, buyer_ids: buyer_ids}, status: 200
  end

  def create
    search_start_date = Date.parse(params[:date])
    buyer_ids = JSON.parse(params[:buyer_ids])
    @auction = Auction.new
    @auction.contract_period_start_date = search_start_date
    @auction.buyer_type = if buyer_ids.size == 1
                            Auction::SingleBuyerType
                          elsif buyer_ids.size == 0
                            Auction::MultipleBuyerType
                          elsif buyer_ids.size > 1
                            Auction::MultipleBuyerType
                          end
    create_auction_at_update
    if @auction.save!
      buyer_ids.each do |id|
        consumption = Consumption.new
        consumption.auction_id = @auction.id
        consumption.user_id = id
        consumption.action_status = Consumption::ActionStatusPending
        consumption.participation_status = Consumption::ParticipationStatusPending
        consumption.save
      end
    end
    render json: {auction: @auction}, status: 200
  end

  # GET auction info by ajax
  def obtain
    if params[:id].nil?
      render json: nil
    else
      auction = Auction.find(params[:id])
      if auction.published_date_time.nil? && auction.publish_status == Auction::PublishStatusPublished
        auction.published_date_time = AuctionEvent.find_by_auction_id(auction.id).where(auction_do: 'publish').take.updated_at
      end
      if auction.auction_contracts.blank?
        render json: auction, status: 200
      else
        render json: get_auction_details(auction), status: 200
      end

    end
  end

  # PATCH update auction by ajax
  def update
    if params[:id] == '0' # create
      auction_update_create_func
    else # update
      # params[:auction]['total_volume'] = Auction.set_total_volume(model_params[:total_lt_peak], model_params[:total_lt_off_peak], model_params[:total_hts_peak], model_params[:total_hts_off_peak], model_params[:total_htl_peak], model_params[:total_htl_off_peak])
      auction_update_update_func
    end
  end

  def destroy
    if @auction.publish_status == '0'
      @auction.destroy
      render json: nil, status: 200
    else
      render json: { message: 'The auction already published, you can not delete it!' }, status: 200
    end
  end

  # PUT publish auction by ajax
  def publish
    exist_published_gid = @auction.published_gid
    published_gid = if exist_published_gid.nil? || exist_published_gid == ''
                      "RA#{Time.current.year}" + (Auction.published.current_year.count + 1).to_s.rjust(4, '0')
                    else
                      exist_published_gid
                    end

    if @auction.update(publish_status: params[:publish_status], published_gid: published_gid, published_date_time: Time.current)
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
    end
    render json: @auction, status: 200
  end

  # POST hold auction for long pulling
  def hold
    hold_status = params[:hold_status] == 'true'
    # click hold
    if hold_status
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: true, forward: false }, status: 200
      end
    elsif !hold_status && Time.current < @auction.actual_begin_time
      if @auction.update(hold_status: hold_status)
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: false, forward: false }, status: 200
      end
    elsif !hold_status && Time.current > @auction.actual_begin_time
      if @auction.update(hold_status: hold_status, actual_begin_time: Time.current, actual_end_time: Time.current + 60 * @auction.duration)
        # link = set_link(@auction.id, 'dashboard')
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: { hold_status: false, forward: true }, status: 200
      end
    end
  end

  # GET current time by ajax
  def timer
    render json: { current_time: Time.current, hold_status: @auction.hold_status, actual_begin_time: @auction.actual_begin_time, actual_end_time: @auction.actual_end_time }, status: 200
  end

  # POST confirm
  def confirm
    auction_result = AuctionResult.find_by_auction_id(params[:id])
    if params[:contract_duration].blank?
      auction_result = set_old_confirm(params, auction_result)
    else
      auction_result = set_contract_duration_confirm(params, auction_result)
    end

    render json: auction_result, status: 200
  end

  def unpublished
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      auction = Auction.unpublished.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      total = auction.total_count
    else
      auction = Auction.unpublished
      total = auction.count
    end
    headers = [
        { name: 'Name', field_name: 'name' },
        { name: 'Date/Time', field_name: 'actual_begin_time' }
    ]
    actions = [
        { url: '/admin/auctions/:id/buyer_dashboard?unpublished', name: 'Buyer Dashboard', icon: 'view', interface_type: 'auction' },
        { url: '/admin/auctions/new', name: 'Manage', icon: 'manage', interface_type: 'auction' },
        { url: '/admin/auctions/:id', name: 'Delete', icon: 'delete', interface_type: 'auction' }
    ]
    data = if params.key?(:sort_by)
             order_by_string = get_order_by_obj_str(params[:sort_by], headers)
             auction.order(order_by_string)
           else
             auction.order(actual_begin_time: :asc)
           end
    auctions = []
    data.each do |auction|
      consumptions = Consumption.find_by_auction_id(auction.id).is_participation
      consumptions_all_count = consumptions.count
      consumptions_accept_count = consumptions.where(accept_status: Consumption::AcceptStatusApproved).count
      all_accept = consumptions_all_count == consumptions_accept_count ? true : false
      auctions.push(id: auction.id, name: auction.name, actual_begin_time: auction.actual_begin_time, all_accept: all_accept)
    end
    bodies = { data: auctions, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def published
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      auction = Auction.published.has_auction_result.where(search_where_array)
                    .page(params[:page_index]).per(params[:page_size])
      total = auction.total_count
    else
      auction = Auction.published
      total = auction.count
    end
    headers = [
        { name: 'ID', field_name: 'published_gid' },
        { name: 'Name', field_name: 'name' },
        { name: 'Date/Time', field_name: 'actual_begin_time' },
        { name: 'Status', field_name: 'status', is_sort: false }
    ]
    actions = [
        { url: '/admin/auctions/:id/retailer_dashboard', name: 'Retailer Dashboard', icon: 'edit', interface_type: 'auction' },
        { url: '/admin/auctions/:id/buyer_dashboard?published', name: 'Buyer Dashboard', icon: 'view', interface_type: 'auction' },
        { url: '/admin/auctions/:id/upcoming', name: 'Manage', icon: 'manage', interface_type: 'auction' },
        { url: '/admin/auctions/:id/online', name: 'Commence', icon: 'bidding', interface_type: 'auction' }
    ]
    data = []
    auctions = get_published_order_list(params, headers, auction)
    auctions.each do |auction|
      status = if Time.current < auction.actual_begin_time
                 'Upcoming'
                 # elsif Time.current >= auction.actual_begin_time && Time.current <= auction.actual_end_time
               else
                 'In Progress'
               end
      incomplete = Auction.check_start_price_incomplete(auction)
      data.push(id: auction.id, published_gid: auction.published_gid, name: auction.name, actual_begin_time: auction.actual_begin_time, status: status, incomplete: incomplete)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  # Admin create auction select retailer. If retailer's account is not approved, can't find
  # params[:status]: "0", "Not Invited", "1":"Invited", "2":"Pending Notification",  "3":"Notification Sent"
  def retailers
    if params.key?(:page_size) && params.key?(:page_index)
      users_search_params = select_params(params, %w[company_name])
      search_where_array = set_search_params(users_search_params)
      users = User.retailers.retailer_approved.where(search_where_array)
      arrangements = Arrangement.find_by_auction_id(params[:id])
      ids = get_user_ids(arrangements)
      users = get_retailer_users(params, users, ids)
      users = users.page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.retailers
      total = users.count
    end
    headers = [
        { name: 'Company Name', field_name: 'company_name' },
        { name: 'Status', field_name: 'select_status', is_sort: false },
        { name: 'Action', field_name: 'select_action', is_sort: false }
    ]
    actions = [
        { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
    ]
    data = []
    users = get_retailer_order_list(params, headers, users)
    users.each do |user|
      index = get_retailer_index(arrangements, user)
      arrangement = get_retailer_arrangement_value(index, arrangements)
      status = get_retailer_status_value(arrangement)
      action = get_retailer_action_value(arrangement)
      data.push(user_id: user.id, company_name: user.company_name, select_status: status, select_action: action, lock: false)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def buyers
    if params.key?(:page_size) && params.key?(:page_index)
      consumer_type = params[:consumer_type][0]
      users_search_params = if consumer_type == '2'
                              select_params(params, %w[company_name consumer_type])
                            elsif consumer_type == '3'
                              select_params(params, %w[name consumer_type account_housing_type])
                            else
                              []
                            end
      search_where_array = set_search_params(users_search_params)
      users = User.buyers.buyer_approved.where(search_where_array)
      consumptions = Consumption.find_by_auction_id(params[:id])
      ids = get_user_ids(consumptions)
      users = get_buyer_users(params, users, ids)
      users = users.page(params[:page_index]).per(params[:page_size])
      total = users.total_count
    else
      users = User.buyers
      total = users.count
    end
    if consumer_type == '2'
      headers = [
          { name: 'Company Name', field_name: 'company_name' },
          { name: 'Status', field_name: 'select_status', is_sort: false },
          { name: 'Action', field_name: 'select_action', is_sort: false }
      ]
      actions = [
          { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
      ]
      users = get_company_buyer_order_list(params, headers, users)
    elsif consumer_type == '3'
      headers = [
          { name: 'Name', field_name: 'name', table_name: 'users' },
          { name: 'Housing Type', field_name: 'account_housing_type' },
          { name: 'Status', field_name: 'select_status', is_sort: false },
          { name: 'Action', field_name: 'select_action', is_sort: false }
      ]
      actions = [
          { url: '/admin/users/:id/manage', name: 'View', icon: 'view', interface_type: 'show_detail' }
      ]
      users = get_individual_buyer_order_list(params, headers, users)
    else
      headers = []
      actions = []
    end

    auction = Auction.find(params[:id])
    company_consumptions_sent_count = auction.consumptions.find_by_user_consumer_type(User::ConsumerTypeCompany).where(action_status: Consumption::ActionStatusSent).count
    lock = company_consumptions_sent_count > 0 && auction.buyer_type == Auction::SingleBuyerType ? true : false
    data = []
    users.each do |user|
      # status = ids.include?(user.id) ? '1' : '0'
      index = get_buyer_index(consumptions, user)
      consumption = get_buyer_consumption_value(index, consumptions)
      status = get_buyer_status_value(consumption)
      action = get_buyer_action_value(consumption)
      if consumer_type == '2'
        data.push(user_id: user.id, company_name: user.company_name, select_status: status, select_action: action, lock: lock)
      elsif consumer_type == '3'
        data.push(user_id: user.id, name: user.name, account_housing_type: user.account_housing_type, select_status: status, select_action: action, lock: false)
      end
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: actions }, status: 200
  end

  def selects
    retailers = Arrangement.find_by_auction_id(params[:id]).find_by_approvaled_user.group(:action_status).count
    company_buyers = Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('2').group(:action_status).count
    individual_buyers = Consumption.find_by_auction_id(params[:id]).find_by_user_consumer_type('3').group(:action_status).count

    render json: { retailers: retailers, company_buyers: company_buyers, individual_buyers: individual_buyers }, status: 200
  end

  def send_mails
    auction_id = params[:id]
    role_name = params[:role_name]
    if role_name == 'retailer'
      user_ids = Arrangement.find_by_auction_id(auction_id).is_not_notify.pluck(:user_id)
      Arrangement.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      retailer_send_mails user_ids
    elsif role_name == 'buyer'
      auction = Auction.find(auction_id)
      if auction.tc_attach_info.blank?
        auction = Auction.find(params[:auction_id])
        tc_attach_info = {}
        tc_attach_info[:SELLER_BUYER_TC] = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC).id
        tc_attach_info[:SELLER_REVV_TC] = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC).id
        tc_attach_info[:BUYER_REVV_TC] = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC).id

        auction.tc_attach_info = tc_attach_info.to_json
        auction.save
      end
      user_ids = Consumption.find_by_auction_id(auction_id).is_not_notify.pluck(:user_id)
      Consumption.find_by_auction_id(auction_id).is_not_notify.update_all(action_status: '1')
      buyer_send_mails user_ids
    end
    render json: nil, status: 200
  end

  def retailer_dashboard
    tenders = TenderWorkflow.new.get_action_state_machine_only_approval_pending(params[:id]) #get_action_state_machine
    step_counts = [0, 0, 0, 0, 0, 0, 0]
    tenders.each do |tender|

      step_counts[0] += 1
      step_counts[6] += 1 if tender[:detail][:current][:current_status] == 'closed'
      flows = tender[:detail][:flows]
      unless flows.nil?
        flows.each do |flow|
          step_counts[flow] += 1
        end
      end

    end

    render json: { tenders: tenders, step_counts: step_counts }, status: 200
  end

  def buyer_dashboard
    consumptions_company = []
    consumptions = Consumption.find_by_auction_id(params[:id])
    consumptions.find_by_user_consumer_type('2').order(:participation_status).each do |consumption|
      consumptions_company.push(id: consumption.id, name: consumption.user.company_name, participation_status: consumption.participation_status, accept_status: consumption.accept_status, user_status:consumption.user.approval_status )
    end
    count_company = consumptions_company.count

    consumptions_individual = []
    consumptions.find_by_user_consumer_type('3').order(:participation_status).each do |consumption|
      consumptions_individual.push(id: consumption.id, name: consumption.user.name, participation_status: consumption.participation_status, accept_status: consumption.accept_status, user_status:consumption.user.approval_status )
    end
    count_individual = consumptions_individual.count
    render json: { consumptions_company: consumptions_company, count_company: count_company, consumptions_individual: consumptions_individual, count_individual: count_individual }, status: 200
  end

  def log
    if params.key?(:page_size) && params.key?(:page_index)
      contract_duration = params[:contract_duration]
      search_params = reject_params(params, %w[controller action sort_by contract_duration])
      search_where_array = set_search_params(search_params)
      result = AuctionEvent.find_by_auction_id(params[:id]).where(search_where_array)
      unless contract_duration.blank?
        set_bid = "set bid #{params[:contract_duration]} months"
        auction_do = ['update', 'confirm', 'extend_time', 'hold', 'publish', set_bid]
        result = result.where(auction_do: auction_do)
      end
      result = result.page(params[:page_index]).per(params[:page_size])
      total = result.total_count
    else
      result = AuctionEvent.all
      total = result.count
    end
    headers = [
        { name: 'Name', field_name: 'name', is_sort: false },
        { name: 'Date', field_name: 'auction_when', is_sort: false },
        { name: 'Action', field_name: 'auction_do', is_sort: false },
        { name: 'Details', field_name: 'auction_what', is_sort: false }
    ]
    data = []
    result.order(created_at: :desc).each do |event|
      data.push(name: event.user.company_name, auction_when: event.auction_when,
                auction_do: event.auction_do, auction_what: event.auction_what)
    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end

  def letter_of_award_pdf
    auction_id = params[:auction_id]
    user_id = params[:user_id]
    contract_duration = params[:contract_duration]
    entity_id = params[:entity_id]

    auction = Auction.find_by id: auction_id

    auction_result, consumption, tender_state, consumption_details, auction_contract, is_parent = get_letter_of_award_pdf_data(auction_id, user_id, contract_duration, entity_id)
    pdf_param = {
        :user_id => user_id,
        :auction => auction,
        :auction_result => auction_result,
        :consumption => consumption,
        :tender_state => tender_state,
        :consumption_details => consumption_details,
        :auction_contract => auction_contract
    }
    if auction_result.nil?
      pdf, output_filename =  PdfUtils.get_wicked_pdf_data('no data', 'NO_DATA_LETTER_OF_AWARD.pdf')
    elsif entity_id.blank?
      pdf, output_filename = LetterOfAward.new(pdf_param).pdf
    else
      template_type = if is_parent
                        RichTemplate::LETTER_OF_AWARD_TEMPLATE
                      else
                        RichTemplate::NOMINATED_ENTITY_TEMPLATE
                      end
      pdf, output_filename = LetterOfAwardV2.new(pdf_param, template_type).pdf
    end

    send_data(pdf, filename: output_filename)
  end

  def check_buyer_type
    auction = Auction.find(params[:id])
    count = auction.consumptions.find_by_user_consumer_type(User::ConsumerTypeCompany).count
    if count > 0 && params[:buyer_type] != auction.buyer_type
      render json: { count: count }, status: 200
    else
      render json: { count: 0 }, status: 200
    end
  end

  def delete_selected_buyer
    auction = Auction.find(params[:id])
    if params[:buyer_type] != auction.buyer_type
      auction.consumptions.find_by_user_consumer_type(User::ConsumerTypeCompany).destroy_all
      render json: { status: '1' }, status: 200
    else
      render json: { status: nil }, status: 200
    end
  end

  private

  def retailer_send_mails(user_ids)
    return if user_ids.empty?
    User.where('id in (?)', user_ids).each do |user|
      UserMailer.retailer_invited_email(user).deliver_later
    end
  end

  def buyer_send_mails(user_ids)
    return if user_ids.empty?
    User.where('id in (?)', user_ids).each do |user|
      UserMailer.buyer_invited_email(user).deliver_later
    end
  end

  def set_auction
    @auction = params[:id] == '0' ? Auction.new(model_params) : Auction.find(params[:id])
  end

  def model_params
    params.require(:auction).permit(:name, :start_datetime, :contract_period_start_date, :contract_period_end_date, :duration, :reserve_price, :actual_begin_time, :actual_end_time, :total_volume, :publish_status, :published_gid,
                                    :total_lt_peak, :total_lt_off_peak, :total_hts_peak, :total_hts_off_peak, :total_htl_peak, :total_htl_off_peak, :total_eht_peak, :total_eht_off_peak, :hold_status, :time_extension, :average_price, :retailer_mode, :starting_price,
                                    :starting_price_time, :buyer_type, :allow_deviation )
  end

  def set_link(auctionId, addr)
    "/admin/auctions/#{auctionId}/#{addr}"
  end

  def get_letter_of_award_pdf_data(auction_id, user_id, contract_duration, entity_id)
    if contract_duration.blank? && entity_id.blank?
      consumption, auction_result, consumption_details, auction_contract, is_parent = get_data_v0(auction_id, user_id)
    else
      consumption, auction_result, consumption_details, auction_contract, is_parent = get_data_entity(auction_id, user_id, contract_duration, entity_id)
    end
    return nil, nil,nil, nil, nil, nil if (consumption.blank? || auction_result.blank?)

    winner_user_id = auction_result[0].user_id unless auction_result.empty?
    tender_state = TenderStateMachine
                       .find_by_sql ["SELECT *
                                  FROM tender_state_machines
                                  WHERE  current_node = 4
                                    AND turn_to_role = 1
                                    AND \"current_role\" = 2
                                    AND arrangement_id = (SELECT id
                                                          FROM arrangements
                                                          WHERE auction_id = ?
                                                          AND user_id = ?
                                                          LIMIT 1)
                                    ORDER BY created_at DESC LIMIT 1", auction_id, winner_user_id]


    return auction_result, consumption, tender_state, consumption_details, auction_contract, is_parent
  end

  def get_data_v0(auction_id, user_id)
    consumption = Consumption.select("users.id, users.name, coalesce(users.company_name, '') company_name,
                                  coalesce(users.company_address, '') company_address,
                                  coalesce(users.company_unique_entity_number,'') company_unique_entity_number,
                                  consumptions.*")
                      .joins(:user)
                      .where('auction_id = ? AND user_id = ?', auction_id, user_id)


    auction_result = AuctionResult.select("users.id, users.name, coalesce(users.company_name, '') company_name,
                                  coalesce(users.company_address, '') company_address,
                                  coalesce(users.company_unique_entity_number, '') company_unique_entity_number,
                                  auction_results.*")
                         .joins(:user)
                         .where('auction_id = ?', auction_id)
                         .limit 1

    consumption_id = consumption[0].id unless consumption.empty?
    consumption_details = ConsumptionDetail.find_by_consumption_id(consumption_id)
    return consumption, auction_result, consumption_details, nil, nil
  end

  def get_data_entity(auction_id, user_id, contract_duration, entity_id)
    return nil, nil,nil, nil, nil if (contract_duration.blank? || entity_id.blank?)
    consumption = Consumption.find_by_sql ["SELECT
                                    cns.*,
                                    coalesce(entity.company_name,'') company_name,
                                    coalesce(entity.company_uen,'') company_unique_entity_number,
                                    coalesce(users.company_name,'') parent_company_name
                                  FROM
                                    consumptions cns
                                  LEFT JOIN users ON cns.user_id = users.\"id\",
                                    ( SELECT ent.company_name, ent.company_uen FROM company_buyer_entities ent WHERE ent.user_id = ? AND \"id\" = ? LIMIT 1 ) entity
                                  WHERE
                                    cns.user_id = ? AND auction_id = ? AND contract_duration = ?",
                                           user_id, entity_id, user_id, auction_id, contract_duration]
    # AND accept_status = '1'
    return nil, nil,nil, nil, nil if (consumption.empty?)
    auction_result = AuctionResultContract.select("users.id, users.name, coalesce(users.company_name, '') company_name,
                                  coalesce(users.company_address, '') company_address,
                                  coalesce(users.company_unique_entity_number, '') company_unique_entity_number,
                                  auction_result_contracts.*")
                         .joins(:user)
                         .where("auction_id = ? AND contract_duration = ? AND status= 'win'", auction_id, contract_duration)
                         .limit 1
    consumption_details = nil
    consumption_details = ConsumptionDetail.find_by_sql ['SELECT 	cbe."id",	cbe.company_name, cds.*
                                         FROM	consumption_details cds
	                                       LEFT JOIN company_buyer_entities cbe
                                           ON cds.company_buyer_entity_id = cbe."id"
                                        WHERE	cds.consumption_id = ? AND cds.company_buyer_entity_id = ?
                                        ', consumption[0].id, entity_id]   unless consumption.empty?
    auction_contract = AuctionContract.find_by auction_id: auction_id, contract_duration: contract_duration

    return consumption, auction_result, consumption_details, auction_contract, consumption[0].company_name == consumption[0].parent_company_name
  end

  def create_auction_at_update
    @auction.publish_status = '0'
    @auction.total_lt_peak = 0
    @auction.total_lt_off_peak = 0
    @auction.total_hts_peak = 0
    @auction.total_hts_off_peak = 0
    @auction.total_htl_peak = 0
    @auction.total_htl_off_peak = 0
    @auction.total_eht_peak = 0
    @auction.total_eht_off_peak = 0
    @auction.total_volume = 0
  end

  def save_auction_contracts(auction_contracts, auction)
    contracts = JSON.parse(auction_contracts)
    contracts.each do |contract|
      month = contract['contract_duration'].to_i
      contract['contract_period_end_date'] = auction.contract_period_start_date.advance(months: month).advance(days: -1)
      if contract['id'].to_i == 0
        contract['auction_id'] = auction.id
        contract['id'] = nil
        AuctionContract.create!(contract)
      else
        AuctionContract.find(contract['id']).update!(contract)
      end
    end
  end

  def update_auction_contracts(auction_contracts, auction)
    contracts = JSON.parse(auction_contracts)
    ids = []
    contracts.each do |contract|
      ids.push(contract['id']) if contract['id'].to_i != 0
    end
    will_del_contracts = auction.auction_contracts.reject do |contract|
      ids.include?(contract['id'].to_i)
    end
    will_del_contracts.each do |contract|
      AuctionContract.find(contract['id']).destroy
    end
    save_auction_contracts(auction_contracts, auction)
  end

  def auction_update_create_func
    ActiveRecord::Base.transaction do
      create_auction_at_update
      if @auction.save!
        unless params[:auction][:auction_contracts].nil?
          save_auction_contracts(params[:auction][:auction_contracts] , @auction)
        end
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
        render json: get_auction_details(@auction), status: 201
      end
    end
  end

  def auction_update_update_func
    if @auction.update!(model_params)
      unless params[:auction][:auction_contracts].nil?
        update_auction_contracts(params[:auction][:auction_contracts] , @auction)
      end
      auction = Auction.find(@auction.id)
      if auction.publish_status == Auction::PublishStatusPublished
        calculate_dto = CalculateDto.new
        calculate_dto.auction_id = auction.id
        calculate_dto.begin_time = auction.contract_period_start_date
        if auction.auction_contracts.blank? # old
          calculate_dto.total_lt_peak = auction.total_lt_peak
          calculate_dto.total_lt_off_peak = auction.total_lt_off_peak
          calculate_dto.total_hts_peak = auction.total_hts_peak
          calculate_dto.total_hts_off_peak = auction.total_hts_off_peak
          calculate_dto.total_htl_peak = auction.total_htl_peak
          calculate_dto.total_htl_off_peak = auction.total_htl_off_peak
          calculate_dto.total_eht_peak = auction.total_eht_peak
          calculate_dto.total_eht_off_peak = auction.total_eht_off_peak
          calculate_dto.lt_peak = auction.starting_price
          calculate_dto.lt_off_peak = auction.starting_price
          calculate_dto.hts_peak = auction.starting_price
          calculate_dto.hts_off_peak = auction.starting_price
          calculate_dto.htl_peak = auction.starting_price
          calculate_dto.htl_off_peak = auction.starting_price
          calculate_dto.eht_peak = auction.starting_price
          calculate_dto.eht_off_peak = auction.starting_price
          calculate_dto.end_time = auction.contract_period_end_date
          update_auction_at_update(calculate_dto)
        else
          contracts = auction.auction_contracts
          contracts.each do | contract |
            calculate_dto.total_lt_peak = contract.total_lt_peak
            calculate_dto.total_lt_off_peak = contract.total_lt_off_peak
            calculate_dto.total_hts_peak = contract.total_hts_peak
            calculate_dto.total_hts_off_peak = contract.total_hts_off_peak
            calculate_dto.total_htl_peak = contract.total_htl_peak
            calculate_dto.total_htl_off_peak = contract.total_htl_off_peak
            calculate_dto.total_eht_peak = contract.total_eht_peak
            calculate_dto.total_eht_off_peak = contract.total_eht_off_peak
            calculate_dto.lt_peak = Auction.set_zero(contract.starting_price_lt_peak)
            calculate_dto.lt_off_peak = Auction.set_zero(contract.starting_price_lt_off_peak)
            calculate_dto.hts_peak = Auction.set_zero(contract.starting_price_hts_peak)
            calculate_dto.hts_off_peak = Auction.set_zero(contract.starting_price_hts_off_peak)
            calculate_dto.htl_peak = Auction.set_zero(contract.starting_price_htl_peak)
            calculate_dto.htl_off_peak = Auction.set_zero(contract.starting_price_htl_off_peak)
            calculate_dto.eht_peak = Auction.set_zero(contract.starting_price_eht_peak)
            calculate_dto.eht_off_peak = Auction.set_zero(contract.starting_price_eht_off_peak)
            calculate_dto.end_time = contract.contract_period_end_date
            calculate_dto.contract_duration = contract.contract_duration
            update_auction_at_update(calculate_dto)
          end
        end
      end
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], @auction.to_json)
    end
      render json: get_auction_details(@auction), status: 200
  end

  def update_auction_at_update(calculate_dto)
    days = Auction.get_days(calculate_dto.begin_time, calculate_dto.end_time)
    total_award_sum = AuctionHistory.set_total_award_sum(Auction.set_c_value(calculate_dto.total_lt_peak, days),
                                          Auction.set_c_value(calculate_dto.total_lt_off_peak, days),
                                          Auction.set_c_value(calculate_dto.total_hts_peak, days),
                                          Auction.set_c_value(calculate_dto.total_hts_off_peak, days),
                                          Auction.set_c_value(calculate_dto.total_htl_peak, days),
                                          Auction.set_c_value(calculate_dto.total_htl_off_peak, days),
                                          Auction.set_c_value(calculate_dto.total_eht_peak, days),
                                          Auction.set_c_value(calculate_dto.total_eht_off_peak, days),
                                          calculate_dto.lt_peak, calculate_dto.lt_off_peak,
                                          calculate_dto.hts_peak, calculate_dto.hts_off_peak,
                                          calculate_dto.htl_peak, calculate_dto.htl_off_peak,
                                          calculate_dto.eht_peak, calculate_dto.eht_off_peak)
    total_volume = Auction.set_total_volume(
        calculate_dto.total_lt_peak, calculate_dto.total_lt_off_peak,
        calculate_dto.total_hts_peak, calculate_dto.total_hts_off_peak,
        calculate_dto.total_htl_peak, calculate_dto.total_htl_off_peak,
        calculate_dto.total_eht_peak, calculate_dto.total_eht_off_peak )
    new_total_volume = Auction.set_c_value(total_volume, days)

    average_price = AuctionHistory.set_average_price(total_award_sum, new_total_volume)
    if calculate_dto.contract_duration.blank?
      Arrangement.where(auction_id: calculate_dto.auction_id, accept_status: Arrangement::AcceptStatusAccept)
          .update_all(lt_peak: @auction.starting_price, lt_off_peak: @auction.starting_price,
                      hts_peak: @auction.starting_price, hts_off_peak: @auction.starting_price,
                      htl_peak: @auction.starting_price, htl_off_peak: @auction.starting_price,
                      eht_peak: @auction.starting_price, eht_off_peak: @auction.starting_price)
      AuctionHistory.find_init_bidder(calculate_dto.auction_id)
          .update_all(bid_time: @auction.actual_begin_time, actual_bid_time: @auction.actual_begin_time,
                      lt_peak: @auction.starting_price, lt_off_peak: @auction.starting_price,
                      hts_peak: @auction.starting_price, hts_off_peak: @auction.starting_price,
                      htl_peak: @auction.starting_price, htl_off_peak: @auction.starting_price,
                      eht_peak: @auction.starting_price, eht_off_peak: @auction.starting_price,
                      total_award_sum: total_award_sum, average_price: average_price)
      # set sorted histories to redis
      histories = AuctionHistory.find_init_bidder(calculate_dto.auction_id)
      RedisHelper.set_current_sorted_histories(@auction.id, histories)
    else
      AuctionHistory.find_init_bidder(calculate_dto.auction_id).find_contract_duration(calculate_dto.contract_duration)
          .update_all(bid_time: @auction.actual_begin_time, actual_bid_time: @auction.actual_begin_time,
                      lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak,
                      hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak,
                      htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak,
                      eht_peak: calculate_dto.eht_peak, eht_off_peak: calculate_dto.eht_off_peak,
                      total_award_sum: total_award_sum, average_price: average_price,
                      contract_duration: calculate_dto.contract_duration)
      # set sorted histories to redis
      histories = AuctionHistory.find_init_bidder(calculate_dto.auction_id).find_contract_duration(calculate_dto.contract_duration)
      RedisHelper.set_current_sorted_histories_duration(@auction.id, histories, calculate_dto.contract_duration)
    end
  end

  def get_published_order_list(params, headers, auction)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      auction.order(order_by_string)
    else
      auction.order(actual_begin_time: :asc)
    end
  end

  def get_retailer_users(params, users, ids)
    if !params[:status].nil? && params[:status][0] == '0'
      users = users.exclude(ids) unless ids.empty?
    elsif !params[:status].nil? && params[:status][0] == '1'
      users = users.selected_retailers(params[:id])
    elsif !params[:status].nil? && (params[:status][0] == '2' || params[:status][0] == '3')
      action_status = params[:status][0] == '2' ? '2' : '1'
      users = users.selected_retailers_action_status(params[:id], action_status)
    end
    users
  end

  def get_retailer_order_list(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(company_name: :asc)
    end
  end

  def get_retailer_index(arrangements, user)
    arrangements.index do |arrangement|
      arrangement.user_id == user.id
    end
  end

  def get_retailer_arrangement_value(index, arrangements)
    index.nil? ? nil : arrangements[index]
  end

  def get_retailer_status_value(arrangement)
    arrangement.nil? ? nil : arrangement.action_status
  end

  def get_retailer_action_value(arrangement)
    arrangement.nil? ? nil : arrangement.id
  end


  def get_buyer_users(params, users, ids)
    if !params[:status].nil? && params[:status][0] == '0'
      users = users.exclude(ids) unless ids.empty?
    elsif !params[:status].nil? && params[:status][0] == '1'
      users = users.selected_buyers(params[:id])
    elsif !params[:status].nil? && (params[:status][0] == '2' || params[:status][0] == '3')
      action_status = params[:status][0] == '2' ? '2' : '1'
      users = users.selected_buyers_action_status(params[:id], action_status)
    end
    users
  end

  def get_company_buyer_order_list(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(company_name: :asc)
    end
  end

  def get_individual_buyer_order_list(params, headers, users)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      users.order(order_by_string)
    else
      users.order(name: :asc)
    end
  end

  def get_buyer_index(consumptions, user)
    consumptions.index do |consumption|
      consumption.user_id == user.id
    end
  end

  def get_buyer_consumption_value(index, consumptions)
    index.nil? ? nil : consumptions[index]
  end

  def get_buyer_status_value(consumption)
    consumption.nil? ? nil : consumption.action_status
  end

  def get_buyer_action_value(consumption)
    consumption.nil? ? nil : consumption.id
  end

  def get_auction_details(auction)
    live_auction_contracts = get_lived_auction_contracts(auction, true)
    live_auction_contracts.each do |contract|
      auction.total_lt_peak += Consumption.change_nil_value(contract[:total_lt_peak])
      auction.total_lt_off_peak += Consumption.change_nil_value(contract[:total_lt_off_peak])
      auction.total_hts_peak += Consumption.change_nil_value(contract[:total_hts_peak])
      auction.total_hts_off_peak += Consumption.change_nil_value(contract[:total_hts_off_peak])
      auction.total_htl_peak += Consumption.change_nil_value(contract[:total_htl_peak])
      auction.total_htl_off_peak += Consumption.change_nil_value(contract[:total_htl_off_peak])
      auction.total_eht_peak += Consumption.change_nil_value(contract[:total_eht_peak])
      auction.total_eht_off_peak += Consumption.change_nil_value(contract[:total_eht_off_peak])
    end

    auction_json = auction.attributes.dup
    if auction.publish_status == Auction::PublishStatusPublished
      auction_json[:aggregate_auction_contracts] = live_auction_contracts
    else
      auction_json[:aggregate_auction_contracts] = get_unpublished_auction_contracts(auction)
    end
    auction_json[:contract_end_list] = get_contract_end_list(auction)
    auction_json[:auction_contracts] = Auction.find(auction.id).auction_contracts.sort_by {|contract| contract.contract_duration.to_i}
    auction_json[:buyer_notify] = Consumption.find_by_auction_id(auction.id).find_notify_buyer.blank? ? false : true
    auction_json[:live_auction_contracts] = live_auction_contracts
    auction_json[:contract_end_list] = get_contract_end_list(auction)
    auction_json
  end

  def get_contract_end_list(auction)
    contract_end_list = []
    contracts = auction.auction_contracts.sort_by {|contract| contract.contract_duration.to_i}
    contracts.each do |c|
      if auction.publish_status == Auction::PublishStatusPublished
        contract_end_list.push(push_data_to_contract_end_list(c)) if has_live_contract(c)
      else
        contract_end_list.push(push_data_to_contract_end_list(c))
      end
    end
    contract_end_list
  end

  def push_data_to_contract_end_list(contract)
    count = Consumption.where(contract_duration: contract.contract_duration, auction_id: contract.auction_id).is_participation.is_accpet.count
    { id: contract.auction_id, contract_duration: contract.contract_duration, contract_period_end_date: contract.contract_period_end_date.strftime("%d-%m-%Y"), count: count, link: "/admin/auctions/#{contract.auction_id}/consumption?type=2&contract_duration=#{contract.contract_duration}&from=1" }
  end

  def set_contract_duration_confirm(params, auction_result)
    auction_result_contract = AuctionResultContract.new
    auction_result = AuctionResult.new if auction_result.nil?
    auction_contract = @auction.auction_contracts.where('contract_duration = ?', params[:contract_duration]).first
    auction_result.auction_id = params[:id].to_i
    auction_result.contract_period_start_date = @auction.contract_period_start_date
    if auction_result.save!
      auction_result_contract = auction_result_contract if auction_result.auction_result_contracts.where('contract_duration = ?', params[:contract_duration])
      history = AuctionHistory.select('auction_histories.* ,users.company_name').joins(:user).where('auction_id = ? and user_id = ? and is_bidder = true and contract_duration = ?', params[:id], params[:user_id], params[:contract_duration]).order(actual_bid_time: :desc).first
      auction_result_contract.reserve_price_lt_peak = auction_contract.reserve_price_lt_peak
      auction_result_contract.reserve_price_lt_off_peak = auction_contract.reserve_price_lt_off_peak
      auction_result_contract.reserve_price_hts_peak = auction_contract.reserve_price_hts_peak
      auction_result_contract.reserve_price_hts_off_peak = auction_contract.reserve_price_hts_off_peak
      auction_result_contract.reserve_price_htl_peak = auction_contract.reserve_price_htl_peak
      auction_result_contract.reserve_price_htl_off_peak = auction_contract.reserve_price_htl_off_peak
      auction_result_contract.reserve_price_eht_peak = auction_contract.reserve_price_eht_peak
      auction_result_contract.reserve_price_eht_off_peak = auction_contract.reserve_price_eht_off_peak
      auction_result_contract.status = params[:status]
      auction_result_contract.contract_period_end_date = auction_contract.contract_period_end_date
      auction_result_contract.total_volume = auction_contract.total_volume
      auction_result_contract.lowest_average_price = history.average_price
      auction_result_contract.lowest_price_bidder = history.company_name
      auction_result_contract.total_award_sum = history.total_award_sum
      auction_result_contract.lt_peak = history.lt_peak
      auction_result_contract.lt_off_peak = history.lt_off_peak
      auction_result_contract.hts_peak = history.hts_peak
      auction_result_contract.hts_off_peak = history.hts_off_peak
      auction_result_contract.htl_peak = history.htl_peak
      auction_result_contract.htl_off_peak = history.htl_off_peak
      auction_result_contract.eht_peak = history.eht_peak
      auction_result_contract.eht_off_peak = history.eht_off_peak
      auction_result_contract.user_id = params[:user_id]
      auction_result_contract.justification = params[:justification]
      auction_result_contract.auction_id = params[:id].to_i
      auction_result_contract.auction_result = auction_result
      auction_result_contract.contract_duration = params[:contract_duration]
      set_auction_result_template_id auction_result_contract
      if auction_result_contract.save!
        live_auction_contracts_count = get_lived_auction_contracts(@auction, true).count
        result_auction_contracts_count = AuctionResultContract.where(auction_result_id: auction_result.id).count
        if live_auction_contracts_count == result_auction_contracts_count
          auction_result.status = '1'
          auction_result.save!
        end
        AuctionEvent.set_events(current_user.id, @auction.id, request[:action], auction_result_contract.to_json)
      end
    end
    winner_send_mails(params[:user_id], params[:id], params[:contract_duration]) if params[:status] == AuctionResultContract::STATUS_WIN
    auction_result_contract_hash = auction_result_contract.attributes.dup
    auction_result_contract_hash['contract_period_start_date'] = auction_result.contract_period_start_date
    auction_result_contract_hash
  end

  def set_auction_result_template_id(auction_result_contract)
    parent_template = RichTemplate.where(type: RichTemplate::LETTER_OF_AWARD_TEMPLATE).last
    entity_template = RichTemplate.where(type: RichTemplate::NOMINATED_ENTITY_TEMPLATE).last
    auction_result_contract.parent_template_id = parent_template.id if parent_template
    auction_result_contract.entity_template_id = entity_template.id if entity_template
  end

  def set_old_confirm(params, auction_result)
    auction_result = AuctionResult.new if auction_result.nil?
    auction_result.auction_id = params[:id].to_i
    history = AuctionHistory.select('auction_histories.* ,users.company_name').joins(:user).where('auction_id = ? and user_id = ? and is_bidder = true ', params[:id], params[:user_id]).order(actual_bid_time: :desc).first
    auction_result.reserve_price = @auction.reserve_price
    auction_result.lowest_average_price = history.average_price
    auction_result.status = params[:status]
    auction_result.lowest_price_bidder = history.company_name
    auction_result.contract_period_start_date = @auction.contract_period_start_date
    auction_result.contract_period_end_date = @auction.contract_period_end_date
    auction_result.total_volume = @auction.total_volume
    auction_result.total_award_sum = history.total_award_sum
    auction_result.lt_peak = history.lt_peak
    auction_result.lt_off_peak = history.lt_off_peak
    auction_result.hts_peak = history.hts_peak
    auction_result.hts_off_peak = history.hts_off_peak
    auction_result.htl_peak = history.htl_peak
    auction_result.htl_off_peak = history.htl_off_peak
    auction_result.eht_peak = history.eht_peak
    auction_result.eht_off_peak = history.eht_off_peak
    auction_result.user_id = params[:user_id]
    auction_result.justification = params[:justification]
    # end
    if auction_result.save!
      AuctionEvent.set_events(current_user.id, @auction.id, request[:action], auction_result.to_json)
    end

    auction_result
  end

  def winner_send_mails(user_id, auction_id, contract_duration)
    user = User.find_by id: user_id
    auction = Auction.find_by id: auction_id
    date_of_ra = (auction.start_datetime + (8 * 60 * 60)).strftime("%-d %b %Y")
    ra_id = auction.published_gid
    months = ["#{contract_duration} months"]
    UserMailer.winner_confirmation(user,{ :date_of_ra => date_of_ra, :ra_id => ra_id, :months => months }).deliver_later
  end
end
