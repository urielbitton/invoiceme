import { db } from "app/firebase/fire"

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