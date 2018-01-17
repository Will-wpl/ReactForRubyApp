class Api::TendersController < Api::BaseController

  def current
    workflow = TenderWorkflow.new.get_arrangement_state_machine(params[:id])
    render json: workflow, status: 200
  end

  def node1_retailer
    auction_id = @arrangement.auction_id
  end

  def node2_retailer

  end

  def node3_retailer

  end

  def node4_retailer

  end

  def node5_retailer

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
