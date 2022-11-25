import { geCurrentYearInvoices, getCUrrentMonthInvoices } from "app/services/statsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCurrentMonthInvoices = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [revenue, setRevenue] = useState(0)

  useEffect(() => {
    getCUrrentMonthInvoices(myUserID, date, setRevenue)
  }, [myUserID, date])

  return revenue
}

export const useCurrentYearInvoices = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [revenue, setRevenue] = useState([])

  useEffect(() => {
    geCurrentYearInvoices(myUserID, date, setRevenue)
  }, [myUserID])

  return revenue
}