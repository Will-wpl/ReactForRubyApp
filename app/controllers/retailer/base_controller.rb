class Retailer::BaseController < ApplicationController
    before_action :retailer_required
    
    private

    def retailer_required
        head :unauthorized unless current_user && current_user.has_role?(:retailer)
    end
end
