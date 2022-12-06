import { CardElement } from "@stripe/react-stripe-js"
import { functions } from "app/firebase/fire"
import { updateDB } from "./CrudDB"

export const createPaymentMethodService = (myUser, userID, stripe, elements, setLoading) => {
  if(myUser?.stripe?.paymentMethodID) return Promise.resolve(myUser.stripe.paymentMethodID)
  else if (elements == null) return
    return stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    .then((res) => {
      return res.paymentMethod.id
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error creating payment method', error)
    })
}

export const createCustomerService = (myUser, userID, data, setLoading) => {
  if(myUser?.stripe?.stripeCustomerID) return Promise.resolve(myUser.stripe.stripeCustomerID)
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
      "stripe.paymentMethodID": res.data.id,
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
      "stripe.stripeSubscriptionID": res.data.subscriptionID,
      "stripe.stripeSubscriptionStatus": res.data.subscriptionStatus,
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