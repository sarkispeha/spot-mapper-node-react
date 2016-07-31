import {Mandrill} from 'mandrill-api/mandrill';
// const Mandrill = require('mandrill-api/mandrill').Mandrill
const mandrillClient = new Mandrill(process.env.MANDRILL_API_KEY)

/*eslint-disable camelcase */

function mandrillTransaction (templateName, subject, friendName, email) {
  console.log('SENDING EMAIL from mandrillSend');
  // TODO: Provide actual template content, or remove.
  var templateContent = [{
    name: 'example name',
    content: 'example content'
  }];

  var message = {
    subject: subject,
    from_email: 'sarkis@sarkispeha.com',
    from_name: 'Sark',
    to: [{
      email: email,
      name: friendName,
      type: 'to'
    }],
    headers: {
      'Reply-To': 'sarkis@sarkispeha.com'
    },
    // TODO: Do these have default values? Can we remove them?
    important: false,
    track_opens: null,
    track_clicks: null,
    auto_text: null,
    auto_html: null,
    inline_css: null,
    url_strip_qs: null,
    preserve_recipients: null,
    view_content_link: null,
    tracking_domain: null,
    signing_domain: null,
    return_path_domain: null,
    merge: true,
    merge_language: 'mailchimp',
    // TODO: Determine if we're using these.
    global_merge_vars: [
      {
        name: 'FNAME',
        content: friendName
      }
    ]
  }

  mandrillClient.messages.sendTemplate({
    template_name: templateName,
    template_content: templateContent,
    message: message,
    async: false,
    ip_pool: 'Main Pool'
  }, function (result) {
    // TODO: Success behavior?
    console.log(result)
  }, function (err) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + err.name + ' - ' + err.message)
  })
}

module.exports = mandrillTransaction;