import { db } from "app/firebase/fire"
import { firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
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
}