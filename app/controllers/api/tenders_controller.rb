class Api::TendersController < Api::BaseController

  def current
    workflow = $tender_workflow.get_arrangement_state_machine(params[:id])
    render json: workflow, status: 200
  end

  # work flow function
  def node1_retailer_accept
    workflow = $tender_workflow.execute(:node1, :accept, params[:id]) do
    end

    render json: workflow, status: 200
  end

  def node1_retailer_reject
    workflow = $tender_workflow.execute(:node1, :reject, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node2_retailer_accept_all
    workflow = $tender_workflow.execute(:node2, :accept_all, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node2_retailer_propose_deviations
    workflow = $tender_workflow.execute(:node2, :propose_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_withdraw_all_deviations
    workflow = $tender_workflow.execute(:node3, :withdraw_all_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_submit_deviations
    workflow = $tender_workflow.execute(:node3, :submit_deviations, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_retailer_next
    workflow = $tender_workflow.execute(:node3, :next, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node3_send_response
    workflow = $tender_workflow.execute(:node3, :send_response, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_retailer_submit
    workflow = $tender_workflow.execute(:node4, :submit, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_retailer_next
    workflow = $tender_workflow.execute(:node4, :next, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_admin_accept
    workflow = $tender_workflow.execute(:node4, :accept, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node4_admin_reject
    workflow = $tender_workflow.execute(:node4, :reject, params[:id]) do

    end
    render json: workflow, status: 200
  end

  def node5_retailer_submit
    workflow = $tender_workflow.execute(:node5, :submit, params[:id]) do

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
end
