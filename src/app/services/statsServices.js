import { db } from "app/firebase/fire"
import { getFirstDayOfMonthAsDate, getFirstDayOfYearAsDate, getLastDayOfMonthAsDate, getLastDayOfYearAsDate } from "app/utils/dateUtils"

export const getCurrentMonthInvoices = (userID, monthStart, monthEnd, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', new Date(monthStart))
  .where('dateCreated', '<=', new Date(monthEnd))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearInvoices = (userID, yearStart, yearEnd, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', new Date(yearStart))
  .where('dateCreated', '<=', new Date(yearEnd))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getCurrentMonthEstimates = (userID, monthStart, monthEnd, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', new Date(monthStart))
  .where('dateCreated', '<=', new Date(monthEnd))
  .onSnapshot((snapshot) => {
    setEstimates(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearEstimates = (userID, yearStart, yearEnd, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', new Date(yearStart))
  .where('dateCreated', '<=', new Date(yearEnd))
  .onSnapshot((snapshot) => {
    setEstimates(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getCurrentMonthContacts = (userID, monthStart, monthEnd, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('dateCreated', '>=', new Date(monthStart))
  .where('dateCreated', '<=', new Date(monthEnd))
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearContacts = (userID, yearStart, yearEnd, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('dateCreated', '>=', new Date(yearStart))
  .where('dateCreated', '<=', new Date(yearEnd))
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getActiveMonthInvoices = (userID, date, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfMonthAsDate(date))
  .where('dateCreated', '<=', getLastDayOfMonthAsDate(date))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map(doc => doc.data()))
  })
}

export const getActiveYearInvoices = (userID, year, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(year))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(year))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getActiveYearEstimates = (userID, date, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(date))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(date))
  .onSnapshot((snapshot) => {
    setEstimates(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getActiveYearContacts = (userID, date, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(date))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(date))
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map((doc) => doc.data()))
  })
}
