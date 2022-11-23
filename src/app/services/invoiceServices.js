import { db } from "app/firebase/fire"
import { deleteDB, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { sendHtmlToEmailAsPDF } from "./emailServices"
import { createNotification } from "./notifServices"

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

export const createInvoiceService = (userID, invoiceCurrency, invoiceDueDate, invoiceNumber, invoiceContact,
  invoiceItems, invoiceNotes, taxRate1, taxRate2, calculatedSubtotal, calculatedTotal, invoiceName) => {
  const path = `users/${userID}/invoices`
  const docID = getRandomDocID(path)
  const invoiceData = {
    currency: invoiceCurrency,
    dateCreated: new Date(),
    dateDue: new Date(invoiceDueDate),
    invoiceID: docID,
    invoiceNumber: `INV-${invoiceNumber}`,
    invoiceOwnerID: userID,
    invoiceTo: invoiceContact,
    isPaid: false,
    isSent: false,
    items: invoiceItems,
    notes: invoiceNotes,
    status: 'unpaid',
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
    title: invoiceName
  }
  return setDB(path, docID, invoiceData)
    .then(() => {
      updateDB('users', userID, {
        invoicesNum: firebaseIncrement(1)
      })
      createNotification(
        userID,
        'Invoice Created',
        `Invoice ${invoiceName} (${invoiceData.invoiceNumber}) has been created for ${invoiceContact.name}.`,
        'fas fa-file-invoice-dollar',
        `/invoices/${docID}`
      )
    })
    .catch(err => console.log(err))
}

export const updateInvoiceService = (myUserID, invoiceID, updatedProps, setLoading) => {
  setLoading(true)
  return updateDB(`users/${myUserID}/invoices`, invoiceID, updatedProps)
  .then(() => {
    setLoading(false)
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
  })
}

export const deleteInvoiceService = (myUserID, invoiceID, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this invoice?")
    if (confirm) {
      setLoading(true)
      return deleteDB(`users/${myUserID}/invoices`, invoiceID)
      .then(() => {
        return updateDB('users', myUserID, {
          invoicesNum: firebaseIncrement(-1) 
        })
        .then(() => {
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
}

export const sendInvoiceService = (to, subject, emailHTML, pdfHTMLElement, invoiceFilename, uploadedFiles,
  myUserID, invoiceID, invoiceNumber, setPageLoading) => {
    const confirm = window.confirm("Send invoice to client?")
    if(confirm) {
      setPageLoading(true)
      return sendHtmlToEmailAsPDF(
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
          'Invoice Sent to client',
          `Invoice ${invoiceNumber} has been sent to ${to}.`,
          'fas fa-paper-plane',
          `/invoices/${invoiceID}`
        )
        .catch(err => console.log(err))
        setPageLoading(false)
        alert("Invoice sent to client.")
      })
      .catch((error) => {
        setPageLoading(false)
        alert(error)
      })
    }
}