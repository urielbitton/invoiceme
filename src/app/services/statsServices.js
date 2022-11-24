import { db } from "app/firebase/fire"
import { getFirstDayOfMonthAsDate, 
  getFirstDayOfYearAsDate, 
  getLastDayOfMonthAsDate, 
  getLastDayOfYearAsDate} from "app/utils/dateUtils"

export const calculateMonthlyRevenue = (userID, date, setRevenue) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfMonthAsDate(date))
  .where('dateCreated', '<=', getLastDayOfMonthAsDate(date))
  .onSnapshot((snapshot) => {
    setRevenue(snapshot.docs.reduce((acc, doc) => {
      return acc + (doc.data().isPaid ? doc.data().total : 0)
    }, 0))
  })
}

export const calculateYearlyRevenueByMonth = (userID, date, setRevenue) => {
  db.collection('users')
  .doc(userID)
  .collection('invoices')
  .where('dateCreated', '>=', getFirstDayOfYearAsDate(date))
  .where('dateCreated', '<=', getLastDayOfYearAsDate(date))
  .onSnapshot((snapshot) => {
    setRevenue(snapshot.docs.map((doc) => doc.data()))
  })
}