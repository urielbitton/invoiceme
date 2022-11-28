import { db } from "app/firebase/fire"
import { convertInputDateToDateAndTimeFormat, 
  dateToMonthName } from "app/utils/dateUtils"
import { deleteDB, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { sendHtmlToEmailAsPDF } from "./emailServices"
import { createNotification } from "./notifServices"

const catchError = (err, setLoading) => {
  setLoading(false)
  console.log(err)
}

export const getInvoicesByUserID = (userID, setInvoices, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snapshot => {
    setInvoices(snapshot.docs.map(doc => doc.data()))
  })
}

export const getInvoiceByID = (userID, invoiceID, setInvoice) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .doc(invoiceID)
  .onSnapshot(snapshot => {
    setInvoice(snapshot.data())
  })
}

export const getInvoicesByContactEmail = (userID, email, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('invoiceTo.email', '==', email)
  .orderBy('dateCreated', 'desc')
  .onSnapshot(snapshot => {
    setInvoices(snapshot.docs.map(doc => doc.data()))
  })
}

export const createInvoiceService = (userID, invoiceCurrency, invoiceDate, invoiceDueDate, invoiceNumber, 
  invoiceContact, invoiceItems, invoiceNotes, taxRate1, taxRate2, calculatedSubtotal, calculatedTotal, 
  invoiceName, status) => {
  const path = `users/${userID}/invoices`
  const docID = getRandomDocID(path)
  const invoiceData = {
    currency: invoiceCurrency,
    dateCreated: convertInputDateToDateAndTimeFormat(invoiceDate),
    dateDue: convertInputDateToDateAndTimeFormat(invoiceDueDate),
    invoiceID: docID,
    invoiceNumber: `INV-${invoiceNumber}`,
    invoiceOwnerID: userID,
    invoiceTo: invoiceContact,
    isPaid: status === 'paid',
    isSent: false,
    items: invoiceItems,
    monthLabel: dateToMonthName(convertInputDateToDateAndTimeFormat(invoiceDate)),
    notes: invoiceNotes,
    status,
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
    title: invoiceName
  }
  return setDB(path, docID, invoiceData)
    .then(() => {
      createNotification(
        userID,
        'Invoice Created',
        `Invoice ${invoiceName} (${invoiceData.invoiceNumber}) has been created for ${invoiceContact.name}.`,
        'fas fa-file-invoice-dollar',
        `/invoices/${docID}`
      )
      return updateDB('users', userID, {
        invoicesNum: firebaseIncrement(1),
        ...(status === 'paid' && {totalRevenue: firebaseIncrement(calculatedTotal)})
      })
    })
    .catch(err => console.log(err))
}

export const updateInvoiceService = (myUserID, invoiceID, updatedProps, newTotalRevenue, setLoading) => {
  setLoading(true)
  return updateDB(`users/${myUserID}/invoices`, invoiceID, updatedProps)
  .then(() => {
    setLoading(false)
    updateDB('users', myUserID, {
      totalRevenue: newTotalRevenue,
    })
  })
  .catch(err => catchError(err, setLoading))
}

export const deleteInvoiceService = (myUserID, invoiceID, isPaid, invoiceTotal, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this invoice?")
    if (confirm) {
      setLoading(true)
      return deleteDB(`users/${myUserID}/invoices`, invoiceID)
      .then(() => {
        return updateDB('users', myUserID, {
          invoicesNum: firebaseIncrement(-1),
          ...(isPaid && {totalRevenue: firebaseIncrement(-invoiceTotal)})
        })
        .then(() => {
          setLoading(false)
        })
        .catch(err => catchError(err, setLoading))
      })
      .catch(err => catchError(err, setLoading))
    }
}

export const sendInvoiceService = (from, to, subject, emailHTML, pdfHTMLElement, invoiceFilename, uploadedFiles,
  myUserID, invoiceID, invoiceNumber, setLoading) => {
    const confirm = window.confirm("Send invoice to client?")
    if(confirm) {
      setLoading(true)
      return sendHtmlToEmailAsPDF(
        from,
        to,
        subject,
        emailHTML,
        pdfHTMLElement,
        invoiceFilename,
        uploadedFiles.map(file => file.file)
      )
      .then(() => {
        updateDB(`users/${myUserID}/invoices`, invoiceID, {
          isSent: true, 
        })
        .catch(err => console.log(err))
        createNotification(
          myUserID,
          'Invoice sent to client',
          `Invoice ${invoiceNumber} has been sent to ${to}.`,
          'fas fa-paper-plane',
          `/invoices/${invoiceID}`
        )
        .catch(err => console.log(err))
        setLoading(false)
        alert("Invoice sent to client.")
      })
      .catch(err => catchError(err, setLoading))
    }
}