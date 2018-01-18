class Api::TendersController < Api::BaseController

  def current
    workflow = TenderWorkflow.new.get_arrangement_state_machine(params[:id])
    render json: workflow, status: 200
  end

  def node1_retailer
    attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                                   .where(file_type: 'retailer_confidentiality_undertaking_upload')
    render json: attachments, status: 200
  end

  def node2_retailer
    auction = @arrangement.auction
    aggregate_consumptions = { total_lt_peak: auction.total_lt_peak,
                               total_lt_off_peak: auction.total_lt_off_peak,
                               total_hts_peak: auction.total_hts_peak,
                               total_hts_off_peak: auction.total_hts_off_peak,
                               total_htl_peak: auction.total_htl_peak,
                               total_htl_off_peak: auction.total_htl_off_peak,
                               total_eht_peak: auction.total_eht_peak,
                               total_eht_off_peak: auction.total_eht_off_peak }
    attachments = AuctionAttachment.belong_auction(@arrangement.auction_id)
                                   .where(file_type: 'tender_documents_upload')
    render json: { aggregate_consumptions: aggregate_consumptions, attachments: attachments }, status: 200
  end

  def node3_retailer

  end

  def node4_retailer
    attachments = AuctionAttachment.user_auction(@arrangement.auction_id, @arrangement.user_id)
    render json: attachments, status: 200
  end

  def node5_retailer
    attachments = []
    @arrangement.auction.auction_attachments.each do |attachment|
      if attachment.file_type == 'birefing_pack_upload'
        attachments.push(attachment)
      end
    end
    render json: attachments, status: 200
  end

  # work flow function
  def node1_retailer_accept
    workflow = TenderWorkflow.new.execute(:node1, :accept, params[:id]) do
    end

    render json: workflow, status: 200
  end

  def node1_retailer_reject
    workflow = TenderWorkflow.new.execute(:node1, :reject, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node2_retailer_accept_all
    workflow = TenderWorkflow.new.execute(:node2, :accept_all, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node2_retailer_propose_deviations
    workflow = TenderWorkflow.new.execute(:node2, :propose_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_withdraw_all_deviations
    workflow = TenderWorkflow.new.execute(:node3, :withdraw_all_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_submit_deviations
    workflow = TenderWorkflow.new.execute(:node3, :submit_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_next
    workflow = TenderWorkflow.new.execute(:node3, :next, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_send_response
    workflow = TenderWorkflow.new.execute(:node3, :send_response, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_retailer_submit
    workflow = TenderWorkflow.new.execute(:node4, :submit, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_retailer_next
    workflow = TenderWorkflow.new.execute(:node4, :next, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_admin_accept
    workflow = TenderWorkflow.new.execute(:node4, :accept, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_admin_reject
    workflow = TenderWorkflow.new.execute(:node4, :reject, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node5_retailer_submit
    workflow = TenderWorkflow.new.execute(:node5, :submit, params[:id]) do

    end
    render json: workflow, status: 200
  end


  # un-workflow function
  def node3_retailer_save

  end

  def node3_admin_accept

  end

  def node3_admin_reject

  end

  private

  def set_arrangement
    @arrangement = Arrangement.find(params[:id])
  end
end
