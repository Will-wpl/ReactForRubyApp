class UserMailer < ApplicationMailer
  def registered_email(user)
    admin_user = User.find(1)
    mail_template = get_template('1')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name)
    send_email(admin_user.email, email_body, email_subject)
  end

  def approval_email(user)
    mail_template = get_template('2')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name)
    send_email(user.email, email_body, email_subject)
  end

  def reject_email(user)
    mail_template = get_template('3')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name).gsub(/#user.comment/, user.comment)
    send_email(user.email, email_body, email_subject)
  end

  def retailer_invited_email(user)
    mail_template = get_template('5')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name)
    send_email(user.email, email_body, email_subject)
  end

  def buyer_invited_email(user)
    mail_template = get_template('4')
    email_subject = mail_template.subject
    email_body = mail_template.body
    if user.consumer_type == '2'
      email_body = email_body.gsub(/#buyer.name/, user.company_name)
    elsif user.consumer_type == '3'
      email_body = email_body.gsub(/#buyer.name/, user.name)
    end
    send_email(user.email, email_body, email_subject)
  end

  private

  def send_email(email, body, subject)
    mail(to: email,
         body: body,
         content_type: "text/html",
         subject: subject)
  end

  def get_template(type)
    EmailTemplate.find_by_template_type(type)
  end
end
