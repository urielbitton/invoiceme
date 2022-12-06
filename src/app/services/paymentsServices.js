import { functions } from "app/firebase/fire"
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

export const createSubscriptionService = (myUser, userID, data, setLoading) => {
  if(myUser?.stripe?.subscriptionID) {
    console.log('Subscription already exists')
    return Promise.resolve(myUser.stripe.subscriptionID)
  }
  return functions.httpsCallable('createStripeSubscription')(data)
  .then((res) => {
    return updateDB('users', userID, {
      "stripe.stripeSubscriptionID": res.data.id,
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