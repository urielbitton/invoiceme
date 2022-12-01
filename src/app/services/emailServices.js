import { getRandomDocID, setDB } from "./CrudDB"

const { functions, db } = require("app/firebase/fire")
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

export const sendFireEmail = (from, to, subject, html) => {
  const path = 'mail'
  const docID = getRandomDocID(path)
  const data = {
    dateSent: new Date(),
    emailID: docID,
    isRead: false,
    message: {
      html,
      subject
    },
    from: from,
    to
  }
  return setDB(path, docID, data)
  .catch(err => console.log(err))
}

export const sendAppEmail = (from, to, subject, message, files) => {
  if (!files.length) {
    return sendFireEmail(
      from,
      to,
      subject,
      message,
    )
  }
  else {
    return sendSgEmail(
      from,
      to,
      subject,
      message,
      files.map(file => file.file)
    )
  }
}

export const getMyInboxEmails = (myEmail, setEmails, limit) => {
  db.collection('mail')
  .where('to', '==', myEmail)
  .orderBy('dateSent', 'desc')
  .limit(limit)
  .onSnapshot((snapshot) => {
    setEmails(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getMySentEmails = (email, setEmails, limit) => {
  db.collection('emails')
  .where('from', '==', email)
  .orderBy('dateSent', 'desc')
  .limit(limit)
  .onSnapshot((snapshot) => {
    setEmails(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getUnreadEmails = (myEmail, setUnreadEmails) => {
  db.collection('mail')
  .where('to', '==', myEmail)
  .where('isRead', '==', false)
  .onSnapshot((snapshot) => {
    setUnreadEmails(snapshot.docs.map((doc) => doc.data()))
  })
}