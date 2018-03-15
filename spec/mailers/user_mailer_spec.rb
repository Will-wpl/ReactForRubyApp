require 'rails_helper'

RSpec.describe UserMailer, type: :mail do
  let!(:retailer) { create(:user, :with_retailer) }
  let!(:company_buyers) { create(:user, :with_buyer, :with_company_buyer) }
  describe 'user mail' do
    before :each do
      @admin_user = create(:user , :with_admin_id_1)

    end
    it 'registered email', mail: true do
      @template = create(:email_template, subject: 'subject', body: 'body', template_type: '1')
      UserMailer.registered_email(retailer).deliver_now
      expect(open_last_email).to be_delivered_to @admin_user.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'approval email', mail: true do
      @template = create(:email_template, subject: 'subject2', body: 'body2', template_type: '2')
      UserMailer.approval_email(company_buyers).deliver_now
      expect(open_last_email).to be_delivered_to company_buyers.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'reject_email', mail: true do
      @template = create(:email_template, subject: 'subject2', body: 'body2', template_type: '3')
      UserMailer.reject_email(company_buyers).deliver_now
      expect(open_last_email).to be_delivered_to company_buyers.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'retailer invited email', mail: true do
      @template = create(:email_template, subject: 'subject2', body: 'body2', template_type: '5')
      UserMailer.retailer_invited_email(company_buyers).deliver_now
      expect(open_last_email).to be_delivered_to company_buyers.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'buyer_invited_email', mail: true do
      @template = create(:email_template, subject: 'subject2', body: 'body2', template_type: '4')
      UserMailer.buyer_invited_email(company_buyers).deliver_now
      expect(open_last_email).to be_delivered_to company_buyers.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'retailer_submit_mail', mail: true do
      @template = create(:email_template, subject: 'subject6', body: 'body6', template_type: '6')
      UserMailer.retailer_submit_mail(retailer).deliver_now
      expect(open_last_email).to be_delivered_to @admin_user.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'workflow admin accept mail', mail: true do
      @template = create(:email_template, subject: 'subject6', body: 'body6', template_type: '7')
      UserMailer.workflow_admin_accept_mail(retailer).deliver_now
      expect(open_last_email).to be_delivered_to retailer.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

    it 'workflow admin reject mail', mail: true do
      @template = create(:email_template, subject: 'subject6', body: 'body6', template_type: '8')
      UserMailer.workflow_admin_reject_mail(retailer,'comments test').deliver_now
      expect(open_last_email).to be_delivered_to retailer.email
      expect(open_last_email).to have_subject @template.subject
      expect(open_last_email).to have_body_text @template.body
    end

  end
end
