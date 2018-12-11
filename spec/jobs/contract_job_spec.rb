require 'rails_helper'

RSpec.describe ContractJob, :type => :job do
  describe "contract job" do
    before :each do
      @auction_test = create(:auction, name:'Test0207001',start_datetime:'2018-02-07T06:57:00',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',duration:10,reserve_price:0.1222,created_at:'2018-02-07T06:49:44.531577',updated_at:'2018-02-07T06:55:27.423286',actual_begin_time:'2018-02-07T06:57:00',actual_end_time:'2018-02-07T07:07:00',total_volume:39452.05479452054794521,publish_status:1,published_gid:'RA20180009',total_lt_peak:10000.0,total_lt_off_peak:10000.0,total_hts_peak:10000.0,total_hts_off_peak:10000.0,total_htl_peak:10000.0,total_htl_off_peak:10000.0,hold_status:false,time_extension:0,average_price:0,retailer_mode:0,total_eht_peak:10000.0,total_eht_off_peak:10000.0)
      @auction_contract = create(:auction_contract, :six_month, auction_id: @auction_test.id)
    end
    it "have been enqueued", cjob: true do
      ActiveJob::Base.queue_adapter = :test
      ContractJob.perform_later(JSON.parse('{"expiration_days": 220}'))
      expect(ContractJob).to have_been_enqueued.at(:no_wait)
    end

    it "should do job", cjob: true do
      ActiveJob::Base.queue_adapter = :test
      ContractJob.perform_now(JSON.parse('{"expiration_days": 220}'))

    end
  end
end