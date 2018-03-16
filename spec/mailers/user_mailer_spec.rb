require 'rails_helper'

RSpec.describe UserMailer, type: :mail do
  let!(:retailer) { create(:user, :with_retailer) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:individual_buyer) { create(:user, :with_buyer, :with_individual_buyer) }
  before :each do
    @admin_user = create(:user , :with_admin_id_1)
  end
  context 'registered email' do
    before :each do
      @template = create(:email_template, subject: 'subject1', body: 'body1 #user.company_name ,text ', template_type: '1')
      UserMailer.registered_email(retailer).deliver_now
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
      UserMailer.retailer_submit_mail(retailer).deliver_now
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
end
