class Retailer::AuctionsController < Retailer::BaseController

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

  end

  def goto
    @auction = Auction.first
    if @auction.publish_status != '1'
      redirect_to empty_retailer_auctions_path
    elsif @auction.publish_status == '1' && Time.now < @auction.actual_begin_time
      redirect_to upcoming_retailer_auction_path(@auction.id)
    elsif @auction.publish_status == '1' && @auction.actual_begin_time < Time.now < @auction.actual_end_time
      redirect_to live_retailer_auction_path(@auction.id)
    elsif @auction.publish_status == '1' && @auction.actual_end_time < Time.now
      redirect_to finish_retailer_auction_path(@auction.id)
    else
      redirect_to retailer_home_index_path
    end
  end
end
