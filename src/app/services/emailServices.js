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
        ...(files.length > 0 && {
          attachments: [
            ...files.map((file, i) => {
              return {
                content: base64s[i],
                filename: file.name,
                type: file.type,
                disposition: 'attachment'
              }
            })
          ]
        })
      })
      .then((result) => console.log({result, files}))
      .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
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
    .catch((error) => console.log(error))
  })
  .catch(err => console.log(err))
}

export const sendMultipleSgEmails = (to, subject, html, files) => {

}

//sendSgEmail(..., files) - files is an array of file objects, e.g.:
// [
//   {
//     content: base64,
//     filename: file.name,
//     type: file.type,
//     disposition: 'attachment'
//   }
// ]