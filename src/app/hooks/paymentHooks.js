import { errorToast } from "app/data/toastsTemplates"
import { getSentContactPaymentsByUserID, getSentPaymentsByUserID, getSubscriptionsByCustomerService, listCustomerChargesService, retrieveAttachmentPaymentMethodsService, 
  retrieveCustomerService, retrieveInvoicesByCustomerService, 
  retrievePaymentsByCustomerService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCustomerSubscriptions = (customerID, setLoading) => {
  
  const { setToasts } = useContext(StoreContext)
  const [subscriptions, setSubscriptions] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      getSubscriptionsByCustomerService({customerID})
      .then((data) => {
        setSubscriptions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
        setToasts(errorToast('An error occured. Please try again.'))
      })
    }
  },[customerID])

  return subscriptions
}

export const useCustomerPayments = (customerID, setLoading, limit) => {

  const { setToasts } = useContext(StoreContext)
  const [payments, setPayments] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      retrievePaymentsByCustomerService({
        customerID,
        limit
      })
      .then((data) => {
        setPayments(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setLoading(false)
      })
    }
  },[customerID, limit])

  return payments
}

export const useCustomerCharges = (customerID, setLoading, limit) => {

  const { setToasts } = useContext(StoreContext)
  const [charges, setCharges] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      listCustomerChargesService({
        customerID,
        limit
      })
      .then((data) => {
        setCharges(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setLoading(false)
      })
    }
  },[customerID, limit])

  return charges
}

export const useAttachedPaymentMethods = (customerID, setLoading) => {

  const { setToasts } = useContext(StoreContext)
  const [paymentMethods, setPaymentMethods] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      retrieveAttachmentPaymentMethodsService({
        customerID
      })
      .then((data) => {
        setPaymentMethods(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setLoading(false)
      })
    }
  },[customerID])

  return paymentMethods
}

export const useCustomerInvoices = (customerID, setLoading, limit) => {

  const { setToasts} = useContext(StoreContext)
  const [invoices, setInvoices] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      retrieveInvoicesByCustomerService({
        customerID,
        limit
      })
      .then((data) => {
        setInvoices(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setLoading(false)
      })
    }
  },[customerID, limit])

  return invoices
}

export const useStripeCustomer = (customerID, setLoading) => {

  const { setToasts } = useContext(StoreContext)
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    if(customerID) {
      setLoading(true)
      retrieveCustomerService({customerID})
      .then((data) => {
        setCustomer(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setLoading(false)
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

export const useContactSentPayments = (myUserID, contactEmail, limit) => {

  const [sentPayments, setSentPayments] = useState([])

  useEffect(() => {
    if(myUserID) {
      getSentContactPaymentsByUserID(myUserID, contactEmail, setSentPayments, limit)
    }
  },[myUserID, limit])

  return sentPayments
}