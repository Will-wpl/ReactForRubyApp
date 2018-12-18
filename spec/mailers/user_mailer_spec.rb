require 'rails_helper'

RSpec.describe UserMailer, type: :mail do
  let!(:retailer) { create(:user, :with_retailer) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:individual_buyer) { create(:user, :with_buyer, :with_individual_buyer) }
  before :each do
    User.where(id: 1).delete_all
    @admin_user = create(:user , :with_admin_id_1)
  end
  context 'registered email' do
    before :each do
      @template = create(:email_template, subject: 'subject1', body: 'body1 #user.company_name ,text ', template_type: '1')
      UserMailer.registered_email(@admin_user, retailer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to @admin_user.email
    end

    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end

    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, retailer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'approval email' do
    before :each do
      @template = create(:email_template, subject: 'subject2', body: 'body2 text #user.company_name text', template_type: '2')
      UserMailer.approval_email(company_buyer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, company_buyer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'reject_email' do
    before :each do
      @template = create(:email_template, subject: 'subject3', body: 'body3, #user.company_name, text #user.comment', template_type: '3')
      UserMailer.reject_email(company_buyer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, company_buyer.company_name).gsub(/#user.comment/, company_buyer.comment.to_s)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'retailer invited email' do
    before :each do
      @template = create(:email_template, subject: 'subject5', body: 'body5, #user.company_name body text', template_type: '5')
      UserMailer.retailer_invited_email(company_buyer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, company_buyer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'buyer_invited_email' do
    before :each do
      @template = create(:email_template, subject: 'subject4', body: 'body4,#buyer.name', template_type: '4')
      UserMailer.buyer_invited_email(company_buyer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text by consumer_type 2', mail: true do
      email_body = @template.body.gsub(/#buyer.name/, company_buyer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
    it 'have_body_text by consumer_type 3' , mail: true do
      UserMailer.buyer_invited_email(individual_buyer).deliver_now
      email_body = @template.body.gsub(/#buyer.name/, individual_buyer.name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'retailer_submit_mail' do
    before :each do
      @template = create(:email_template, subject: 'subject6 #user.company_name', body: 'body6,#user.company_name', template_type: '6')
      UserMailer.retailer_submit_mail(@admin_user, retailer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to @admin_user.email
    end
    it 'have_subject', mail: true do
      email_subject = @template.subject.gsub(/#user.company_name/, retailer.company_name)
      expect(open_last_email).to have_subject email_subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, retailer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'workflow admin accept mail' do
    before :each do
      @template = create(:email_template, subject: 'subject7', body: 'body7, #user.company_name', template_type: '7')
      UserMailer.workflow_admin_accept_mail(retailer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to retailer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, retailer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'workflow admin reject mail' do
    before :each do
      @template = create(:email_template, subject: 'subject8', body: 'body8 #user.company_name, #user.comment', template_type: '8')
      @comments = 'comments test'
      UserMailer.workflow_admin_reject_mail(retailer, @comments).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to retailer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, retailer.company_name).gsub(/#user.comment/, @comments)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'workflow admin response mail' do
    before :each do
      @template = create(:email_template, subject: 'subject9', body: 'body8 #user.company_name, #user.comment', template_type: '9')
      UserMailer.workflow_admin_response_mail(retailer).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to retailer.email
    end
    it 'have_subject', mail: true do
      expect(open_last_email).to have_subject @template.subject
    end
    it 'have_body_text', mail: true do
      email_body = @template.body.gsub(/#user.company_name/, retailer.company_name)
      expect(open_last_email).to have_body_text email_body
    end
  end

  context 'buyer_participate mail' do
    before :each do
      @template = create(:email_template, subject: 'Buyer clicks Participate', body: 'Dear Admin,<br/><br/>#buyer_company_name has submitted purchase details for participation in an upcoming auction: #name_of_ra on #date_time.<br/><br/>Please proceed to approve/reject the submission at <a href="http://revv.sg">revv.sg</a>', template_type: '26')
      UserMailer.buyer_participate(@admin_user, {:buyer_company_name => 'buyer_company_name', :name_of_ra => 'name_of_ra', :date_time => 'date_time'}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to @admin_user.email
    end
  end

  context 'buyer_participate approved mail' do
    before :each do
      @template = create(:email_template, subject: '#name_of_ra on #date_time has been approved', body: 'Dear #buyer_company_name,<br/><br/>Your purchase details for participation in the upcoming auction (#name_of_ra on #date_time) has been approved.<br/><br/>You may view your approved participation details at <a href="http://revv.sg">revv.sg</a>.', template_type: '27')
      UserMailer.buyer_participate_approved(company_buyer, {:name_of_ra => 'name_of_ra', :date_time => 'date_time'}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
  end

  context 'buyer_participate rejected mail' do
    before :each do
      @template = create(:email_template, subject: '#name_of_ra on #date_time has been rejected', body: 'Dear #buyer_company_name,<br/><br/>Your purchase details for participation in the upcoming auction (#name_of_ra on #date_time) has been rejected.<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '28')
      UserMailer.buyer_participate_rejected(company_buyer, {:name_of_ra => 'name_of_ra', :date_time => 'date_time'}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
  end


  context 'winner confirmation mail' do
    before :each do
      @template = create(:email_template, subject: 'Winner confirmation', body: 'Dear #retailer_company_name,<br/><br/>Congratulations, #retailer_company_name has been awarded the tender for #months electricity purchase category under the reverse auction conducted on #date_of_ra] (ID: #ra_id).<br/><br/>Please proceed to acknowledge the Letter(s) of Award at <a href="http://revv.sg">revv.sg</a>.', template_type: '10')
      UserMailer.winner_confirmation(retailer, {:date_of_ra => 'date_of_ra', :ra_id => 'ra gid', :months => ['6 months']}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to retailer.email
    end
  end

  context 'buyer winner confirmation mail' do
    before :each do
      @template = create(:email_template, subject: 'Auction Results Notification', body: 'Dear #buyer_company_name,<br/><br/>Congratulations, #retailer_company_name has been awarded as your new electricity retailer for the #months months contract commencing on #contract_start_date (ID: #ra_id).<br/><br/>Please proceed to view the electricity purchase report at <a href="http://revv.sg">revv.sg</a>.', template_type: '29')
      UserMailer.buyer_winner_confirmation(company_buyer, { :retailer_company_name => 'company_name', :ra_id => 'ra_id', :months => '6', :contract_start_date => 'contract_start_date'}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
  end

  context 'contract notification mail' do
    before :each do
      @template = create(:email_template, subject: 'contract notification mail', body: 'Dear Admin,<br/><br/>#body.<br/><br/>Please proceed to view the electricity purchase report at <a href="http://revv.sg">revv.sg</a>.', template_type: '30')
      UserMailer.contract_notification(@admin_user, [ {'id':111, 'name':'name', 'contract_period_end_date': 'end date'}]).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to @admin_user.email
    end
  end

  context 'request submitted mail' do
    before :each do
      @template = create(:email_template, subject: 'Request for initiation of reverse auction', body: 'Dear Admin,<br/><br/>#buyer_company_name has submitted a request for initiation of reverse auction.<br/><br/>Please proceed to manage the request at <a href="http://revv.sg">revv.sg</a>.', template_type: '31')
      UserMailer.request_submitted(@admin_user, { :buyer_company_name => 'company_name'}).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to @admin_user.email
    end
  end

  context 'request responded approved mail' do
    before :each do
      @template = create(:email_template, subject: 'Request for initiation of reverse auction responded by Admin', body: 'Dear #buyer_company_name,<br/><br/>Admin has #respond your request for initiation of reverse auction. You will be contacted on the next steps.<br/><br/>Thank you.', template_type: '32')
      UserMailer.request_responded(company_buyer,true).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
  end

  context 'request responded rejected mail' do
    before :each do
      @template = create(:email_template, subject: 'Request for initiation of reverse auction responded by Admin', body: 'Dear #buyer_company_name,<br/><br/>Admin has #respond your request for initiation of reverse auction. You will be contacted on the next steps.<br/><br/>Thank you.', template_type: '32')
      UserMailer.request_responded(company_buyer,false ).deliver_now
    end
    it 'be_delivered_to', mail: true do
      expect(open_last_email).to be_delivered_to company_buyer.email
    end
  end
end
