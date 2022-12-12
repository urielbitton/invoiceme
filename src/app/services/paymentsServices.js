import { db, functions } from "app/firebase/fire"
import { convertUnixDate } from "app/utils/dateUtils"
import { firebaseArrayAdd, updateDB } from "./CrudDB"

export const createPaymentMethodService = (data, setLoading) => {
  return functions.httpsCallable('createPaymentMethod')(data)
  .then((res) => {
    return res.data.id
  })
  .catch((error) => {
    setLoading(false)
    console.log('Error creating payment method', error)
  })
}

export const createCustomerService = (myUser, userID, data, setLoading) => {
  if(myUser?.stripe?.stripeCustomerID) {
    console.log('Customer already exists')
    setLoading(false)
    return Promise.resolve(myUser.stripe.stripeCustomerID)
  }
  return functions.httpsCallable('createStripeCustomer')(data)
  .then((res) => {
    return updateDB('users', userID, {
      "stripe.stripeCustomerID": res.data.id,
    })
    .then(() => {
      setLoading(false)
      console.log('Customer created')
      return res.data.id
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error creating customer', error)
    })
  })
  .catch((error) => {
    setLoading(false)
    console.log('Error creating customer', error)
  })
}

export const attachPaymentMethodsService = (userID, data, setLoading) => {
  return functions.httpsCallable('attachPaymentMethod')(data)
  .then((res) => {
    return updateDB('users', userID, {
      "stripe.paymentMethods": firebaseArrayAdd(res.data.id),
    })
    .then(() => {
      setLoading(false)
      console.log('Payment method attached')
      return res.data.id
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error attaching payment method', error)
    })
  })
}

export const createSubscriptionService = (userID, data, setLoading) => {
  return functions.httpsCallable('createStripeSubscription')(data)
  .then((res) => {
    return updateDB('users', userID, {
      "stripe.subscriptions": firebaseArrayAdd(res.data.id),
    })
    .then(() => {
      setLoading(false)
      console.log('Subscription created')
      return res.data.id
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error creating subscription', error)
    })
  })
  .catch((error) => {
    setLoading(false)
    console.log('Error creating subscription', error)
  })
}

export const retrievePaymentMethodService = (data) => {
  return functions.httpsCallable('retrievePaymentMethod')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving payment method', error)
  })
}

export const getSubscriptionsByCustomerService = (data) => {
  return functions.httpsCallable('getSubscriptionsByCustomerID')(data)
  .then(result => {
    return result.data
  })
  .catch(err => console.log(err))
}

export const cancelSubscriptionService = (myUserID, data) => {
  return functions.httpsCallable('cancelStripeSubscription')(data)
  .then((res) => {
    updateDB('users', myUserID, {
      "stripe.businessPlanExpires": {
        date: convertUnixDate(res.data.current_period_end),
        dayNumber: convertUnixDate(res.data.current_period_end)?.getDate(),
        subscriptionID: res.data.id,
      }
    })
    .catch((error) => console.log(error))
    return res.data
  })
  .catch((error) => {
    console.log('Error cancelling subscription', error)
  })
}

export const reactivateStripeSubscriptionService = (myUserID, data) => {
  return functions.httpsCallable('reactivateStripeSubscription')(data)
  .then((res) => {
    updateDB('users', myUserID, {
      "stripe.businessPlanExpires": null
    })
    .catch((error) => console.log(error))
    return res.data
  })
  .catch((error) => {
    console.log('Error reactivating subscription', error)
  })
}

export const retrievePaymentsByCustomerService = (data) => {
  return functions.httpsCallable('retrievePaymentsByCustomer')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving payments', error)
  })
}

export const listCustomerChargesService = (data) => {
  return functions.httpsCallable('listAllCharges')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving charges', error)
  })
}

export const retrieveAttachmentPaymentMethodsService = (data) => {
  return functions.httpsCallable('retrieveAttachmentPaymentMethods')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving payment methods', error)
  })
}

export const retrieveInvoicesByCustomerService = (data) => {
  return functions.httpsCallable('retrieveInvoicesByCustomer')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving invoices', error)
  })
}

export const retrieveCustomerService = (data) => {
  return functions.httpsCallable('retrieveCustomer')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error retrieving customer', error)
  })
}

export const createPaymentIntentService = (data) => {
  return functions.httpsCallable('createPaymentIntent')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error creating payment intent', error)
  })
}

export const capturePaymentIntentService = (data) => {
  return functions.httpsCallable('capturePaymentIntent')(data)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Error capturing payment intent', error)
  })
}

export const getSentPaymentsByUserID = (userID, setPayments, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('paymentsSent')
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot((snapshot) => {
    setPayments(snapshot.docs.map((doc) => doc.data()))
  })
}