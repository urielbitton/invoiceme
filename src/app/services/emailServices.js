const { functions } = require("app/firebase/fire")
const { convertFileToBase64 } = require("app/utils/fileUtils")

export const sendSgEmail = (to, subject, html, file) => {
  convertFileToBase64(file)
    .then((base64) => {
      functions.httpsCallable('sendEmailWithAttachment')({
        to: to,
        from: 'info@atomicsdigital.com',
        subject: subject,
        html: html,
        ...(file && {
          attachment: base64,
          filename: file.name,
          type: file.type,
          disposition: 'attachment'
        })
      })
    })
}

export const sendMultipleSgEmails = (to, subject, html, files) => {

}