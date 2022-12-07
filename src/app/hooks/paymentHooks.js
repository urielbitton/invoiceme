import { retrievePaymentsByCustomerService } from "app/services/paymentsServices"
import { getSubscriptionsByCustomerService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCustomerSubscriptions = (customerID) => {
  
  const { setPageLoading } = useContext(StoreContext)
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      getSubscriptionsByCustomerService(customerID)
      .then((data) => {
        setSubscriptions(data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID])

  return subscriptions
}

export const useCustomerPaymentsList = (customerID, limit) => {

  const { setPageLoading } = useContext(StoreContext)
  const [payments, setPayments] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      retrievePaymentsByCustomerService({
        customerID,
        limit
      })
      .then((data) => {
        console.log(data.data)
        setPayments(data.data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID, limit])

  return payments
}