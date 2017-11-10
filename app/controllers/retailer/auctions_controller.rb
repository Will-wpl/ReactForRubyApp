class Retailer::AuctionsController < Retailer::BaseController
  after_action :set_login_status, only: [:upcoming, :live, :finish, :empty]
  # GET upcoming page
  def upcoming;
  end

  # GET live page
  def live;
  end

  # GET finish page
  def finish;
  end

  def empty
    @auction = Auction.first
    if @auction.publish_status != '1' || (@auction.publish_status == '1' && @auction.actual_end_time < Time.now && @auction.auction_result.exists?)
      @message = "There is no upcoming reverse auction published."
    elsif (@auction.publish_status == '1' && @auction.actual_begin_time < Time.now && Time.now < @auction.actual_end_time) || (!@auction.auction_result.exists?)
      auction_name = @auction.name
      @message = "#{auction_name} is currently in progress. Please click on 'Start Bidding' button to participate."
    end
  end

  def goto
    @auction = Auction.first
    if @auction.publish_status != '1' || (@auction.publish_status == '1' && @auction.actual_begin_time < Time.now && Time.now < @auction.actual_end_time) || (!@auction.auction_result.exists?)
      redirect_to empty_retailer_auctions_path()
    elsif @auction.publish_status == '1' && Time.now < @auction.actual_begin_time
      redirect_to upcoming_retailer_auction_path(@auction.id)
    # elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.now && Time.now < @auction.actual_end_time
    #   redirect_to live_retailer_auction_path(@auction.id)
    # elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.now && !@auction.auction_result.exists?
    #   redirect_to finish_retailer_auction_path(@auction.id)
    else
      redirect_to retailer_home_index_path
    end
  end

  def gotobid
    @auction = Auction.first
    arrangement = Arrangement.find_by_user_id(current_user.id)
    if @auction.publish_status != '1' || (arrangement.accept_status != '1') || (@auction.publish_status == '1' && @auction.actual_end_time < Time.now ) && (@auction.auction_result.nil?)
      redirect_to message_retailer_auctions_path()
    elsif @auction.publish_status == '1' && Time.now < @auction.actual_begin_time && arrangement.accept_status == '1'
      redirect_to live_retailer_auction_path(@auction.id)
    elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.now && Time.now < @auction.actual_end_time && arrangement.accept_status == '1'
      redirect_to live_retailer_auction_path(@auction.id)
    elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.now && !@auction.auction_result.exists? && arrangement.accept_status == '1'
      redirect_to finish_retailer_auction_path(@auction.id)
    end
  end

  def message
    @auction = Auction.first
    if @auction.publish_status != '1' || (@auction.publish_status == '1' && @auction.actual_end_time < Time.now) && (@auction.auction_result.nil?)
      @message = "There is no upcoming reverse auction published."
    elsif Arrangement.find_by_user_id(current_user.id).accept_status != '1'
      @message = "Please enter the upcoming reverse auction information. You may click on 'Manage Upcoming Reverse Auction' in homepage."
    end
  end

  private

  def set_login_status
    UserExtension.save_or_update_login_status(current_user, 'login', params[:id], request[:action])
  end

end
