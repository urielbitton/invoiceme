import { db } from "app/firebase/fire"
import { 
  getFirstDayOfMonthAsDate, 
  getFirstDayOfYearAsDate, 
  getLastDayOfMonthAsDate, 
  getLastDayOfYearAsDate
} from "app/utils/dateUtils"

export const getCurrentMonthInvoices = (userID, date, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfMonthAsDate(date))
  .where('dateCreated', '<=', getLastDayOfMonthAsDate(date))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearInvoices = (userID, year, setInvoices) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(year))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(year))
  .onSnapshot((snapshot) => {
    setInvoices(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getCurrentMonthEstimates = (userID, date, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', getFirstDayOfMonthAsDate(date))
  .where('dateCreated', '<=', getLastDayOfMonthAsDate(date))
  .onSnapshot((snapshot) => {
    setEstimates(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearEstimates = (userID, year, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(year))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(year))
  .onSnapshot((snapshot) => {
    setEstimates(snapshot.docs.map((doc) => doc.data()))
  })
}

export const getCurrentMonthContacts = (userID, date, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('dateCreated', '>=', getFirstDayOfMonthAsDate(date))
  .where('dateCreated', '<=', getLastDayOfMonthAsDate(date))
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map(doc => doc.data()))
  })
}

export const geCurrentYearContacts = (userID, year, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(year))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(year))
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map((doc) => doc.data()))
  })
}