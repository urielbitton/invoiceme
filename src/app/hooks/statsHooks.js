import { calculateMonthlyRevenue } from "app/services/statsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useMonthlyRevenue = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [revenue, setRevenue] = useState(0)

  useEffect(() => {
    calculateMonthlyRevenue(myUserID, date, setRevenue)
  }, [myUserID, date])

  return revenue
}