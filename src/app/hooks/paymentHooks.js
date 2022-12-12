import { getSentPaymentsByUserID, getSubscriptionsByCustomerService, listCustomerChargesService, retrieveAttachmentPaymentMethodsService, 
  retrieveCustomerService, retrieveInvoicesByCustomerService, 
  retrievePaymentsByCustomerService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCustomerSubscriptions = (customerID) => {
  
  const { setPageLoading } = useContext(StoreContext)
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      getSubscriptionsByCustomerService({customerID})
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

export const useCustomerPayments = (customerID, limit) => {

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
        setPayments(data)
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

export const useCustomerCharges = (customerID, limit) => {

  const { setPageLoading } = useContext(StoreContext)
  const [charges, setCharges] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      listCustomerChargesService({
        customerID,
        limit
      })
      .then((data) => {
        setCharges(data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID, limit])

  return charges
}

export const useAttachedPaymentMethods = (customerID) => {

  const { setPageLoading } = useContext(StoreContext)
  const [paymentMethods, setPaymentMethods] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      retrieveAttachmentPaymentMethodsService({
        customerID
      })
      .then((data) => {
        setPaymentMethods(data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID])

  return paymentMethods
}

export const useCustomerInvoices = (customerID, limit) => {

  const { setPageLoading } = useContext(StoreContext)
  const [invoices, setInvoices] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      retrieveInvoicesByCustomerService({
        customerID,
        limit
      })
      .then((data) => {
        setInvoices(data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID, limit])

  return invoices
}

export const useStripeCustomer = (customerID) => {

  const { setPageLoading } = useContext(StoreContext)
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    if(customerID) {
      setPageLoading(true)
      retrieveCustomerService({customerID})
      .then((data) => {
        setCustomer(data)
        setPageLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
      })
    }
  },[customerID])

  return customer
}

export const useSentPayments = (myUserID, limit) => {

  const [sentPayments, setSentPayments] = useState([])

  useEffect(() => {
    if(myUserID) {
      getSentPaymentsByUserID(myUserID, setSentPayments, limit)
    }
  },[myUserID, limit])

  return sentPayments
}