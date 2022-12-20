import { db, functions } from "app/firebase/fire"
import { convertFilesToBase64, saveHTMLToPDFAsBlob } from "app/utils/fileUtils"
import { getRandomDocID, setDB } from "./CrudDB"

export const sendSgEmail = (from, to, subject, html, files, isType) => {
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
        .then((result) => {
          console.log({ result, files })
          return sendFireEmail(from, to, subject, html, files, isType)
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
}

export const sendHtmlToEmailAsPDF = (from, to, subject, emailHtml, pdfHTMLElement, filename, attachments, isType) => {
  return saveHTMLToPDFAsBlob(pdfHTMLElement, filename)
    .then((file) => {
      return sendSgEmail(
        from,
        to,
        subject,
        emailHtml,
        [file, ...attachments],
        isType
      )
        .catch((error) => console.log(error))
    })
    .catch(err => console.log(err))
}

export const sendAppEmail = (from, to, subject, message, files) => {
  return sendSgEmail(
    from,
    to,
    subject,
    message,
    files.map(file => file.file),
  )
}

export const sendFireEmail = (from, to, subject, html, files, isType) => {
  const docID = getRandomDocID('mail')
  return setDB('mail', docID, {
    from,
    to,
    subject,
    html,
    files: files?.length > 0 ? files?.map(file => file?.filename || file.name) : [],
    dateSent: new Date(),
    emailID: docID,
    isRead: false,
    isType
  })
  .catch(err => console.log(err))
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
  db.collection('mail')
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

export const createSupportTicketService = (userID, subject, message, email) => {
  const docID = getRandomDocID('support')
  return setDB('support', docID, {
    userID,
    subject,
    message,
    email,
    dateCreated: new Date(),
    supportID: docID,
    isResolved: false,
  })
}