const { functions } = require("app/firebase/fire")
const { convertFilesToBase64, saveHTMLToPDFAsBlob } = require("app/utils/fileUtils")

export const sendSgEmail = (from, to, subject, html, files) => {
  return convertFilesToBase64(files)
    .then((base64s) => {
      return functions.httpsCallable('sendEmailWithAttachment')({
        from: 'info@atomicsdigital.com' || from,
        to: to,
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

export const sendHtmlToEmailAsPDF = (from, to, subject, emailHtml, pdfHTMLElement, filename, attachments) => {
  return saveHTMLToPDFAsBlob(pdfHTMLElement, filename)
  .then((file) => {
    return sendSgEmail(
      from,
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