import React, { useContext } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StoreContext } from "app/store/store"
import AppButton from "../ui/AppButton"
import { attachPaymentMethodsService, createCustomerService, createPaymentMethodService, 
  createSubscriptionService } from "app/services/paymentsServices"
import { firebaseArrayAdd, updateDB } from "app/services/CrudDB"
import { useNavigate } from "react-router-dom"

export default function StripeCreateSubscription(props) {

  const { myUserID, myUser, myUserName, setPageLoading } = useContext(StoreContext)
  const { payBtnLabel } = props
  const stripe = useStripe()
  const elements = useElements()
  const pricePlanID = 'price_1MBgssAp3OtccpN9TKmXnu5t'
  const navigate = useNavigate()

  const startSubscription = (e) => {
    e.preventDefault()
    setPageLoading(true)
    createPaymentMethodService(myUser, myUserID, stripe, elements, setPageLoading)
    .then((paymentMethodID) => {
      setPageLoading(true)
      createCustomerService(
        myUser, 
        myUserID, 
        {
          name: myUserName,
          city: myUser?.city,
          state: myUser?.region,
          country: myUser?.country,
          address: myUser?.address,
          postcode: myUser?.postcode,
          shipping: null,
        }, 
        setPageLoading
      )
      .then(customerID => {
        setPageLoading(true)
        attachPaymentMethodsService(
          myUserID, 
          {
            paymentMethodID,
            customerID
          }, 
          setPageLoading
        )
        .then(() => {
          createSubscriptionService(
            myUserID, 
            {
              customerID,
              priceID: pricePlanID,
              quantity: 1,
              paymentMethodID
            }, 
            setPageLoading
          )
          .then((subscriptionID) => {
            setPageLoading(true)
            alert('Subscription created.')
            return updateDB('users', myUserID, {
              memberType: 'business',
              "stripe.subscriptions": firebaseArrayAdd(subscriptionID) 
            })
            .then(() => {
              navigate('/my-account/payments')
              setPageLoading(false)
              console.log('Member type updated')
            })
            .catch((error) => {
              setPageLoading(false)
              console.log('Error updating member type', error)
            })
          })
        })
      })
    })
  }

  return (
    <form onSubmit={startSubscription}>
      <CardElement 
        options={{
          style: {
            base: {
              fontSize: '15px',
              color: 'var(--grayText)',
              '::placeholder': {
                color: '#aaa',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          }
        }} 
      />
      <AppButton 
        label={payBtnLabel}
        disabled={!stripe || !elements} 
      />
    </form>
  )
}
