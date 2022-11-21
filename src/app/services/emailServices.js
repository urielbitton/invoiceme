const { functions } = require("app/firebase/fire")
const { convertFilesToBase64, saveHTMLToPDFAsBlob } = require("app/utils/fileUtils")

export const sendSgEmail = (to, subject, html, files) => {
  return convertFilesToBase64(files)
    .then((base64s) => {
      return functions.httpsCallable('sendEmailWithAttachment')({
        to: to,
        from: 'info@atomicsdigital.com',
        subject: subject,
        html: html,
        ...(files.length > 0 && [
          ...files.map((file, i) => {
            return {
              attachment: base64s[i],
              filename: file.name,
              type: file.type,
              disposition: 'attachment'
            }
          })
        ])
      })
    })
}

export const sendMultipleSgEmails = (to, subject, html, files) => {

}

export const sendHtmlToEmailAsPDF = (to, subject, emailHtml, pdfHTML, filename, attachments) => {
  return saveHTMLToPDFAsBlob(pdfHTML, filename)
  .then((file) => {
    return sendSgEmail(
      to,
      subject, 
      emailHtml, 
      [file, ...attachments]
    ) 
  })
}

//sendSgEmail(..., files) - files is an array of file objects, e.g.:
// [
//   {
//     attachment: base64,
//     filename: file.name,
//     type: file.type,
//     disposition: 'attachment'
//   }
// ]