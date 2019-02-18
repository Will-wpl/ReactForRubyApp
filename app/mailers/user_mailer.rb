class UserMailer < ApplicationMailer
  def registered_email(admin_user, user)
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
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name).gsub(/#user.comment/, nl2br(CGI.unescape(user.comment.to_s)))
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

  def retailer_submit_mail(admin_user, user)
    mail_template = get_template('6')
    email_subject = mail_template.subject.gsub(/#user.company_name/, user.company_name)
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name)
    send_email(admin_user.email, email_body, email_subject)
  end

  def workflow_admin_accept_mail(user)
    mail_template = get_template('7')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name)
    send_email(user.email, email_body, email_subject)
  end

  def workflow_admin_reject_mail(user, comments)
    mail_template = get_template('8')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name).gsub(/#user.comment/, nl2br(CGI.unescape(comments.to_s)))
    send_email(user.email, email_body, email_subject)
  end

  def workflow_admin_response_mail(user, name)
    mail_template = get_template('9')
    email_subject = mail_template.subject.gsub(/#name/, name.to_s)
    email_body = mail_template.body.gsub(/#user.company_name/, user.company_name).gsub(/#name/, name.to_s)
    send_email(user.email, email_body, email_subject)
  end

  def buyer_participate(admin_user, param)
    mail_template = get_template('26')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#buyer_company_name/, param[:buyer_company_name].to_s).gsub(/#name_of_ra/, param[:name_of_ra].to_s).gsub(/#date_time/, param[:date_time])
    send_email(admin_user.email, email_body, email_subject)
  end

  def buyer_participate_approved(user, param)
    mail_template = get_template('27')
    email_subject = mail_template.subject.gsub(/#name_of_ra/, param[:name_of_ra].to_s).gsub(/#date_time/, param[:date_time])
    email_body = mail_template.body.gsub(/#buyer_company_name/, user.company_name).gsub(/#name_of_ra/, param[:name_of_ra].to_s).gsub(/#date_time/, param[:date_time])
    send_email(user.email, email_body, email_subject)
  end

  def buyer_participate_rejected(user, param)
    mail_template = get_template('28')
    email_subject = mail_template.subject.gsub(/#name_of_ra/, param[:name_of_ra].to_s).gsub(/#date_time/, param[:date_time])
    email_body = mail_template.body.gsub(/#buyer_company_name/, user.company_name).gsub(/#name_of_ra/, param[:name_of_ra].to_s).gsub(/#date_time/, param[:date_time]).gsub(/#comment/, nl2br(CGI.unescape(param[:comment].to_s)))
    send_email(user.email, email_body, email_subject)
  end

  def winner_confirmation(user, param)
    mail_template = get_template('10')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#retailer_company_name/, user.company_name).gsub(/#date_of_ra/, param[:date_of_ra].to_s).gsub(/#ra_id/, param[:ra_id]).gsub(/#months/, param[:months].join(' and '))
    send_email(user.email, email_body, email_subject)
  end

  def buyer_registered_email(admin_user, user)
    mail_template = get_template('11')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#buyer_company_name/, user.company_name)
    send_email(admin_user.email, email_body, email_subject)
  end

  def buyer_winner_confirmation(user, param)
    mail_template = get_template('29')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#buyer_company_name/, user.company_name).gsub(/#retailer_company_name/, param[:retailer_company_name].to_s).gsub(/#ra_id/, param[:ra_id]).gsub(/#months/, param[:months]).gsub(/#contract_start_date/, param[:contract_start_date])
    send_email(user.email, email_body, email_subject)
  end

  def contract_notification(admin_user, param)
    mail_template = get_template('30')
    email_subject = mail_template.subject

    email_body = mail_template.body.gsub(/#days/, param[:days].to_s).gsub(/#buyer_company_name_list/, param[:buyer_company_name_list].collect! { |item| "<li>#{item}" }.join(''))
    send_email(admin_user.email, email_body, email_subject)
  end

  def request_submitted(admin_user, param)
    mail_template = get_template('31')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#buyer_company_name/, param[:buyer_company_name])
    send_email(admin_user.email, email_body, email_subject)
  end

  def request_responded(user, respond_boolean, comment = '')
    comment_text = ''
    respond_text = if respond_boolean
                     comment_text = "Comments: #{comment}" unless comment.blank?
                     'approved'
                   else
                     comment_text = "Comments: #{comment}"
                     'rejected'
                   end
    mail_template = get_template('32')
    email_subject = mail_template.subject
    email_body = mail_template.body.gsub(/#buyer_company_name/, user.company_name).gsub(/#respond/, respond_text.to_s).gsub(/#comment/, nl2br(CGI.unescape(comment_text.to_s)))
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

  def nl2br(s)
    s.gsub(/\n/, '<br>')
  end
end
