const { functions } = require("app/firebase/fire")
const { convertFileToBase64, saveHTMLToPDFAsBlob } = require("app/utils/fileUtils")

export const sendSgEmail = (to, subject, html, file) => {
  return convertFileToBase64(file)
    .then((base64) => {
      return functions.httpsCallable('sendEmailWithAttachment')({
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

export const sendHtmlToEmailAsPDF = (to, subject, emailHtml, pdfHTML, filename) => {
  return saveHTMLToPDFAsBlob(pdfHTML, filename)
  .then((file) => {
    return sendSgEmail(
      to,
      subject, 
      emailHtml, 
      file
    ) 
  })
}